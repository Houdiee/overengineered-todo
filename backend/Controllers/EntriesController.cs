using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

using Entities;
using Dtos;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class EntriesController : ControllerBase
{
    private readonly TodoDbContext _context;

    public EntriesController(TodoDbContext context)
    {
        _context = context;
    }

    [HttpPut]
    public async Task<ActionResult> updateEntries([FromBody] List<EntryDto> request)
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

            var userEntries = request.Select(e => new Entry
            {
                Title = e.Title,
                IsCompleted = e.IsCompleted,
            }).ToList();

            user.Entries.Clear();
            user.Entries.AddRange(userEntries);

            _context.Update(user);
            await _context.SaveChangesAsync();

            return Ok("Successfully updated user todo-list entries");
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
