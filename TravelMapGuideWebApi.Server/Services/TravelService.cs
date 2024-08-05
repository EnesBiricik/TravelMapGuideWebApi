using AutoMapper;
using FluentValidation;
using FluentValidation.Results;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata;
using TravelMapGuideWebApi.Server.Data.Entities;
using TravelMapGuideWebApi.Server.Data.Repositories.Abstract;
using TravelMapGuideWebApi.Server.Helpers;
using TravelMapGuideWebApi.Server.Models.Travel;

namespace TravelMapGuideWebApi.Server.Services
{
    public class TravelService : ITravelService
    {
        private readonly IValidator<CreateTravelModel> _createTravelValidator;
        private readonly IValidator<UpdateTravelModel> _updateTravelValidator;
        private readonly ITravelRepository _travelRepository;
        private readonly IMapper _mapper;


        public TravelService(ITravelRepository travelRepository, IValidator<CreateTravelModel> createTravelValidator, IValidator<UpdateTravelModel> updateTravelValidator, IMapper mapper)
        {
            _travelRepository = travelRepository;
            _createTravelValidator = createTravelValidator;
            _updateTravelValidator = updateTravelValidator;
            _mapper = mapper; // entegre edilecek
        }

        public async Task<Result> CreateAsync(CreateTravelModel model)
        {
            var result = _createTravelValidator.Validate(model);

            if (!result.IsValid)
            {
                var errorMessages = string.Join(", ", result.Errors.Select(e => e.ErrorMessage));
                return Result.Failure("Validation error caught.", errorMessages);
            }

            var travel = _mapper.Map<Travel>(model);

            try
            {
                var entity = await _travelRepository.CreateAsync(travel);
                return Result<Travel>.Success(entity ,"Travel is Created.");
            }
            catch (Exception e)
            {
                return Result.Failure("An error occurred while creating the travel.", e.Message);
            }
        }

        public async Task<Result> UpdateAsync(UpdateTravelModel travelModel)
        {
            var validationResult = await _updateTravelValidator.ValidateAsync(travelModel);
            if (!validationResult.IsValid)
            {
                var errorMessages = string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage));
                return Result.Failure("Validation failed.", errorMessages);
            }

            try
            {
                var updateTravel = _mapper.Map<Travel>(travelModel);

                var result = await _travelRepository.UpdateAsync(updateTravel);
                return Result.Success("Travel update is successful.");
            }
            catch (Exception ex)
            {
                return Result.Failure("An error occurred while updating the travel.", ex.Message);
            }
        }


        public async Task<Result> DeleteAsync(string id)
        {

            if (id == null)
            {
                return Result.Failure("Id cannot be null.");
            }

            try
            {
                await _travelRepository.DeleteAsync(id);
                return Result.Success();
            }
            catch (Exception ex)
            {
                return Result.Failure("An error occurred while deleting the travel.", ex.Message);
            }
        }

        public async Task<Result<IEnumerable<Travel>>> GetAllAsync()
        {
            try
            {
                var travelEntities = await _travelRepository.GetAllAsync();
                var travels = _mapper.Map<IEnumerable<Travel>>(travelEntities);

                return Result<IEnumerable<Travel>>.Success(travels);
            }
            catch (Exception ex)
            {
                return Result<IEnumerable<Travel>>.Failure("An error occurred while getting travels.", ex.Message);
            }
        }


        public async Task<Result<Travel>> GetByIdAsync(string id)
        {
            try
            {
                var travelEntity = await _travelRepository.GetByIdAsync(id);
                if (travelEntity == null)
                {
                    return Result<Travel>.Failure("Travel is not found.");
                }
                var result = _mapper.Map<Travel>(travelEntity);
                return Result<Travel>.Success(result);
            }
            catch (Exception ex)
            {
                return Result<Travel>.Failure("An error occurred while getting the travel.", ex.Message);
            }
        }

    }
}
