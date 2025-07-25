using Microsoft.AspNetCore.Identity;
using ReactExperiment.Backend.API.DTOs;
using ReactExperiment.Backend.API.Models;
using System.Security.Claims;

namespace ReactExperiment.Backend.API.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/auth").WithTags("Authentication");

        group.MapPost("/register", Register).WithName("Register").WithOpenApi();
        group.MapPost("/login", Login).WithName("Login").WithOpenApi();
        group.MapPost("/logout", Logout).WithName("Logout").WithOpenApi();
        group.MapGet("/me", GetCurrentUser).WithName("GetCurrentUser").WithOpenApi().RequireAuthorization();
    }

    static async Task<IResult> Register(
        RegisterDto request,
        UserManager<User> userManager,
        SignInManager<User> signInManager)
    {
        try
        {
            // Check if user already exists
            var existingUser = await userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return TypedResults.BadRequest(new AuthResponse
                {
                    Success = false,
                    Message = "User with this email already exists"
                });
            }

            // Create new user
            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName
            };

            var result = await userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return TypedResults.BadRequest(new AuthResponse
                {
                    Success = false,
                    Message = string.Join(", ", result.Errors.Select(e => e.Description))
                });
            }

            // Sign in the user
            await signInManager.SignInAsync(user, isPersistent: false);

            return TypedResults.Ok(new AuthResponse
            {
                Success = true,
                Message = "Registration successful",
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    FirstName = user.FirstName ?? "",
                    LastName = user.LastName ?? ""
                }
            });
        }
        catch (Exception ex)
        {
            return TypedResults.Problem($"Registration failed: {ex.Message}");
        }
    }

    static async Task<IResult> Login(
        LoginDto request,
        UserManager<User> userManager,
        SignInManager<User> signInManager)
    {
        try
        {
            var user = await userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return TypedResults.BadRequest(new AuthResponse
                {
                    Success = false,
                    Message = "Invalid email or password"
                });
            }

            var result = await signInManager.PasswordSignInAsync(
                user, request.Password, isPersistent: false, lockoutOnFailure: false);

            if (!result.Succeeded)
            {
                return TypedResults.BadRequest(new AuthResponse
                {
                    Success = false,
                    Message = "Invalid email or password"
                });
            }

            return TypedResults.Ok(new AuthResponse
            {
                Success = true,
                Message = "Login successful",
                User = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email!,
                    FirstName = user.FirstName ?? "",
                    LastName = user.LastName ?? ""
                }
            });
        }
        catch (Exception ex)
        {
            return TypedResults.Problem($"Login failed: {ex.Message}");
        }
    }

    static async Task<IResult> Logout(SignInManager<User> signInManager)
    {
        await signInManager.SignOutAsync();
        return TypedResults.Ok(new AuthResponse
        {
            Success = true,
            Message = "Logout successful"
        });
    }

    static async Task<IResult> GetCurrentUser(
        ClaimsPrincipal user,
        UserManager<User> userManager)
    {
        if (!user.Identity?.IsAuthenticated ?? false)
        {
            return TypedResults.Unauthorized();
        }

        var currentUser = await userManager.GetUserAsync(user);
        if (currentUser == null)
        {
            return TypedResults.Unauthorized();
        }

        return TypedResults.Ok(new AuthResponse
        {
            Success = true,
            Message = "User found",
            User = new UserDto
            {
                Id = currentUser.Id,
                Email = currentUser.Email!,
                FirstName = currentUser.FirstName ?? "",
                LastName = currentUser.LastName ?? ""
            }
        });
    }
}
