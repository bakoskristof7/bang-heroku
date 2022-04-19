<?php

namespace App\Http\Controllers\API;

use App\Events\StateChanged;
use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Event;

class RoomController extends Controller
{

    public function create (Request $request){
        //Code..

        $roomId = vsprintf( '%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4) );

        // Get current user
        $userId = Auth::id();
        $user = User::findOrFail($userId);

        $user->roomId = $roomId;

        $user->save();

        event(new StateChanged(null, $roomId));

        return response()->json([
            "status" => 200,
            "request" => $request->all(),
            "roomId" => $roomId
        ]);
    }

    public function join (Request $request){
        //Code..

        // Get current user
        $userId = Auth::id();
        $user = User::findOrFail($userId);

        $user->roomId = $request->roomId;

        $user->save();

        event(new StateChanged(null, $request->roomId));

        return response()->json([
            "status" => 200,
            "message" => "Successful joining!"
        ]);
    }

}
