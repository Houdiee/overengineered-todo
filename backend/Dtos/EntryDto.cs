using Entities;

namespace Dtos;

public class EntryDto
{
    public string Title { get; set; }

    public bool IsCompleted { get; set; }


    public static EntryDto FromEntity(Entry entryEntity)
    {
        return new EntryDto
        {
            Title = entryEntity.Title,
            IsCompleted = entryEntity.IsCompleted,
        };
    }
}
