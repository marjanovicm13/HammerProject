using Amazon.Lambda.AspNetCoreServer;
using Microsoft.AspNetCore.Hosting;

namespace HammerProjectWebAPP
{
  public class LambdaEntryPoint: APIGatewayHttpApiV2ProxyFunction
  {
    protected override void Init(IWebHostBuilder builder)
    {
      builder.UseStartup<Startup>();
    }
  }
}
