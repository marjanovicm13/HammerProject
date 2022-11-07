using Microsoft.EntityFrameworkCore;

namespace HammerProjectWebAPP.Models
{
  public class HammerProjectDbContext: DbContext
  {
    public HammerProjectDbContext(DbContextOptions<HammerProjectDbContext> options) : base(options)
    {

    }

    public DbSet<login> login { get; set; }
    public DbSet<facebookaccounts> facebookaccounts { get; set; }

  }
}
