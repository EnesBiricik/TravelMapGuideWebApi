using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TravelMapGuide.Server.Data.Entities;
using TravelMapGuide.Server.Models.Payment;
using TravelMapGuide.Server.Services;
using TravelMapGuide.Server.Utilities.Helpers;

[Route("api/[controller]")]
[ApiController]
public class PaymentsController : ControllerBase
{
    private readonly IyzipayService _iyzipayService;
    private readonly ITravelService _travelService;

    public PaymentsController(IyzipayService iyzipayService, ITravelService travelService)
    {
        _iyzipayService = iyzipayService;
        _travelService = travelService;
    }

    [Authorize]
    [HttpPost("[action]")]
    public async Task<IActionResult> MakePayment([FromBody] PaymentRequestModel model)
    {
        if (!await _travelService.UserIsValid(model.TravelId))
        {
            return Unauthorized("You do not have access permission.");
        }

        var payment = await _iyzipayService.MakePayment(model.CardNumber, model.CardHolderName, model.ExpireMonth, model.ExpireYear, model.Cvc, model.Price);

        if (payment.Status == "success")
        {
            var result = await _travelService.UpdateFeatureStatus(model.TravelId);
            if (result.IsSuccess)
            {
                return Ok(new { message = "Payment received successfully", paymentId = payment.PaymentId });
            }

            return BadRequest(new { message = "Payment could not be received.", errormessage = result.Error });
        }
        return BadRequest(new { message = "Payment could not be received.", errormessage = payment.ErrorMessage });
    }
}