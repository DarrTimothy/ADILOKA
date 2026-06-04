<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\Region;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'username' => $request->username,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('adiloka')->plainTextToken;

        return ApiResponse::success([
            'id'       => $user->id,
            'username' => $user->username,
            'email'    => $user->email,
            'token' => $token,
        ], 'Selamat datang, ' . $user->username);
    }


    public function login(LoginRequest $request)
    {

        $user = User::where('username', $request->username)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return ApiResponse::unauthorized(
                'Username atau password salah'
            );
        }

        if ($user->tokens()->count() >= 3) {
            $user->tokens()
                ->orderBy('id')
                ->first()
                ?->delete();
        }

        $token = $user->createToken('adiloka')->plainTextToken;



        return ApiResponse::success([
            'id'       => $user->id,
            'username' => $user->username,
            'email'    => $user->email,
            'token' => $token,
        ], 'Selamat datang kembali, ' . $user->username);
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

        $completedRegions = DB::table('region_user')
            ->where('user_id', $user->id)
            ->where('is_completed', true)
            ->count();

        $totalRegions = Region::count();

        $percentage = $totalRegions > 0
            ? round(
                ($completedRegions / $totalRegions) * 100,
                2
            )
            : 0;

        return ApiResponse::success([
            'user' => [
                'id'       => $user->id,
                'username' => $user->username,
                'email'    => $user->email,
            ],
            'progress' => [
                'completed_regions' => $completedRegions,
                'total_regions'     => $totalRegions,
                'percentage'        => $percentage,
            ],
        ], 'Data user berhasil diambil');
    }


    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return ApiResponse::success(
            null,
            'Logout berhasil'
        );
    }
}
