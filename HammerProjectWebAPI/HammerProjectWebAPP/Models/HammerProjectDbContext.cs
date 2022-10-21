using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MySql.EntityFrameworkCore;
using MySql.Data;

namespace HammerProjectWebAPP.Models
{
  public class HammerProjectDbContext: DbContext
  {
    public HammerProjectDbContext(DbContextOptions<HammerProjectDbContext> options) : base(options)
    {

    }

    public DbSet<Login> Login { get; set; }

  }
}
