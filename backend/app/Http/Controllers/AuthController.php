<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'username' => $request->username,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'user',
        ]);

        // login otomatis setelah register
        Auth::guard('web')->login($user);

        // regenerate session untuk keamanan
        $request->session()->regenerate();

        return ApiResponse::success(
            $this->transformUser($user),
            'Selamat datang, ' . $user->username
        );
    }


    public function login(LoginRequest $request)
    {
        $credentials = $request->only('username', 'password');

        if (! Auth::guard('web')->attempt($credentials)) {
            return ApiResponse::unauthorized(
                'Username atau password salah'
            );
        }

        // regenerate session untuk mencegah session fixation
        $request->session()->regenerate();

        /** @var User $user */
        $user = Auth::guard('web')->user();

        return ApiResponse::success(
            $this->transformUser($user),
            'Selamat datang kembali, ' . $user->username
        );
    }


    public function me(Request $request)
    {
        /** @var User|null $user */
        $user = $request->user();

        if (! $user) {
            return ApiResponse::unauthorized(
                'Unauthenticated'
            );
        }

        return ApiResponse::success(
            $this->transformUser($user),
            'Data user berhasil diambil'
        );
    }


    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        // hapus session lama
        $request->session()->invalidate();

        // regenerate csrf token baru
        $request->session()->regenerateToken();

        return ApiResponse::success(
            null,
            'Logout berhasil'
        );
    }

    private function transformUser(User $user): array
    {
        return [
            'id'       => $user->id,
            'username' => $user->username,
            'email'    => $user->email,
            'role'     => $user->role,
        ];
    }
}
