<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Register user baru + auto login (JWT)
     */
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'username' => $request->username,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'user',
        ]);

        // LOGIN PAKAI GUARD API (JWT)
        $token = Auth::guard('api')->login($user);

        return $this->respondWithToken(
            $token,
            'Selamat datang ' . $user->username
        );
    }

    /**
     * Login user (JWT)
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('username', 'password');
        // AUTH VIA JWT GUARD
        if (! $token = Auth::guard('api')->attempt($credentials)) {
            return ApiResponse::unauthorized(
                'username atau password salah'
            );
        }

        return $this->respondWithToken(
            $token,
            'Selamat datang ' . Auth::guard('api')->user()->username
        );
    }

    public function refresh()
    {
        try {
            /** @var JWTGuard $guard */
            $guard = Auth::guard('api');

            $newToken = $guard->refresh();

            return $this->respondWithToken(
                $newToken,
                'Token berhasil diperbarui'
            );
        } catch (\Exception $e) {
            return ApiResponse::unauthorized(
                'Refresh token tidak valid atau sudah expired'
            );
        }
    }

    /**
     * Ambil data user dari token
     */
    public function me()
    {
        return ApiResponse::success(
            Auth::guard('api')->user(),
            'Data user berhasil diambil'
        );
    }

    /**
     * Logout (invalidate JWT)
     */
    public function logout()
    {
        Auth::guard('api')->logout(true);

        return ApiResponse::success(
            null,
            'Logout berhasil'
        );
    }

    /**
     * Response token standar
     */
    protected function respondWithToken(?string $token, string $message)
    {
        /** @var JWTGuard $guard */
        $guard = auth('api');

        $user = $guard->user();

        return ApiResponse::success([
            'id'            => $user->id,
            'username'      => $user->username,
            'email'         => $user->email,
            'role'          => $user->role,


            'access_token'  => $token,
            'expires_in'    => $guard->factory()->getTTL(),
        ], $message);
    }
}
