using Entities;

namespace Dtos;

public class UserDto
{
    public string Username { get; set; } = string.Empty;

    public List<EntryDto> Entries { get; set; } = new List<EntryDto>();


    public static UserDto FromEntity(User userEntity)
    {
        return new UserDto
        {
            Username = userEntity.Username,
            Entries = userEntity.Entries.Select(e => EntryDto.FromEntity(e)).ToList(),
        };
    }
}
