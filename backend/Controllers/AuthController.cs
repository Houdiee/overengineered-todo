using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;

using Entities;
using Dtos;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly TodoDbContext _context;
    private readonly TokenProvider _tokenProvider;

    public AuthController(TodoDbContext context, TokenProvider tokenProvider)
    {
        _context = context;
        _tokenProvider = tokenProvider;
    }

    [HttpPost("login")]
    public async Task<ActionResult> Login([FromBody] LoginRequestDto request)
    {
        try
        {
            var user = await _context.Users
              .Include(u => u.Entries)
              .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user is null)
            {
                return NotFound($"User with username \"{request.Username}\" not found");
            }

            var requestHashedPassword = KeyDerivation.Pbkdf2(
                password: request.Password,
                salt: user.PasswordSalt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: 100000,
                numBytesRequested: 32
            );

            if (!requestHashedPassword.SequenceEqual(user.PasswordHash))
            {
                return Unauthorized("Invalid password");
            }

            var token = _tokenProvider.Create(user);

            return Ok(new LoginResponseDto
            {
                User = UserDto.FromEntity(user),
                Token = token
            });

        }
        catch (Exception e)
        {
            Console.WriteLine(e);

            return Problem(
                detail: "An unexpected problem occurred",
                statusCode: StatusCodes.Status500InternalServerError
            );
        }
    }

    [HttpPost("signup")]
    public async Task<ActionResult> SignUp([FromBody] LoginRequestDto request)
    {
        try
        {
            var user = await _context.Users
              .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user is not null)
            {
                return Conflict($"User with username: \"{request.Username}\" already exists");
            }

            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest($"Username/password cannot be empty");
            }

            var salt = RandomNumberGenerator.GetBytes(32);

            var newUser = new User
            {
                Username = request.Username,
                PasswordHash = KeyDerivation.Pbkdf2(
                    password: request.Password,
                    salt: salt,
                    prf: KeyDerivationPrf.HMACSHA256,
                    iterationCount: 100000,
                    numBytesRequested: 32
                ),
                PasswordSalt = salt,
                Entries = new List<Entry>(),
            };

            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            return Ok(UserDto.FromEntity(newUser));

        }
        catch (Exception e)
        {
            Console.WriteLine(e);

            return Problem(
                detail: "An unexpected problem occurred",
                statusCode: StatusCodes.Status500InternalServerError
            );
        }
    }
}
