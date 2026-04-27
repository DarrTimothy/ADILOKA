<?php

namespace App\Helpers;

class ApiResponse
{
    /** Generic Success */
    public static function success($result = null, $message = "Success", $status = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'result'    => $result,
        ], $status);
    }

    /** Generic Error */
    public static function error($message = "Error", $errors = null, $status = 400)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
        ], $status);
    }

    /** 201 Created */
    public static function created($result = null, $message = "Created")
    {
        return self::success($result, $message, 201);
    }

    /** 404 Not Found */
    public static function notFound($message = "Resource not found")
    {
        return self::error($message, null, 404);
    }

    /** 422 Unprocessable Entity (Validation Error) */
    public static function validationError($errors, $message = "Validation failed")
    {
        return self::error($message, $errors, 422);
    }

    /** 401 Unauthorized */
    public static function unauthorized($message = "Unauthorized")
    {
        return self::error($message, null, 401);
    }

    /** 403 Forbidden */
    public static function forbidden($message = "Forbidden")
    {
        return self::error($message, null, 403);
    }

    /** 500 Server Error */
    public static function serverError($message = "Internal server error", $errors = null)
    {
        return self::error($message, $errors, 500);
    }
}
