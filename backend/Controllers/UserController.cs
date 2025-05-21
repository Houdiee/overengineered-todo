using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

using Entities;
using Dtos;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly TodoDbContext _context;

    public UserController(TodoDbContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult> getUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim is null)
            {
                return Forbid("User ID claim cannot be null");
            }

            int userId = int.Parse(userIdClaim.Value);

            var user = await _context.Users
              .Include(u => u.Entries)
              .FirstOrDefaultAsync(u => u.Id == userId);

            if (user is null)
            {
                return NotFound($"User with id \"{userId}\" does not exit");
            }

            return Ok(UserDto.FromEntity(user));
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
