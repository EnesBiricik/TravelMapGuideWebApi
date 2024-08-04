using AutoMapper;
using TravelMapGuideWebApi.Server.Data.Entities;
using TravelMapGuideWebApi.Server.Models.Travel;

namespace TravelMapGuideWebApi.Server.Mappings.AutoMapper
{
    public class TravelProfile : Profile
    {
        public TravelProfile()
        {
            CreateMap<Travel,CreateTravelModel>().ReverseMap();
            //..updt
        }
    }
}
