<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use function Symfony\Component\String\b;

class AuthController extends Controller
{

    public function register(Request $request){
        $validator = Validator::make($request->all(), [
            'username' => 'required|unique:users,username',
            'email' => 'required|email|max:200|unique:users,email',
            'password' => 'required|confirmed|min:8',
            'password_confirmation' => 'required'
        ], [
            'required' => 'A mező kitöltése kötelező.',
            'unique' => 'Már regisztrálva van az adatbázisban.',
            'confirmed' => 'A jelszavak nem egyeznek.',
            'min' => 'A jelszó legalább 8 karakterből álljon.',
            'max' => 'Az email maximum 200 karakter lehet.'
        ]);

        if ($validator->fails()) {

            return response()->json([
                'errors' => $validator->errors(),
            ]);

        } else {
            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $token = $user->createToken($user->email.'_token')->plainTextToken;

            return response()->json([
                'status' => 200,
                'username' => $user->username,
                'token' => $token,
                'message' => 'Sikeres regisztráció'
            ]);


        }

    }

    public function login (Request $request) {

        $validator = Validator::make($request->all(), [
            'email' => 'required|max:200',
            'password' => 'required'
        ], [
            'required' => 'A mező kitöltése kötelező.',
        ]);

        if ($validator->fails()) {

            return response()->json([
                'errors' => $validator->errors(),
            ]);

        } else {

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {

                return response()->json([
                    'status' => 401,
                    'message' => 'Helytelen bejelentkezési adatok!'
                ]);

            }

            $token = $user->createToken($user->email/*.'_token'*/)->plainTextToken;

            return response()->json([
                'status' => 200,
                'username' => $user->username,
                'token' => $token,
                'message' => 'Sikeres bejelentkezés!'
            ]);

        }
    }

    public function authenticate(Request $request) {
        return response()->json([
            'status' => 200
        ], 200);
    }

    public function logout(Request $request) {
        auth()->user()->tokens()->delete();
        return response()->json([
            'status' => 200,
            'message' => 'Sikeres kijelentkezés!'
        ]);
    }
}
