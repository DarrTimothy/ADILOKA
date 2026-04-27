<?php

namespace App\Http\Requests;

class TraditionalGameRequest extends RequestForm
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->isMethod('POST') || $this->isMethod('PATCH');

        return [
            'region_id' => $isUpdate
                ? 'sometimes|exists:regions,id'
                : 'required|exists:regions,id',

            'title' => $isUpdate
                ? 'sometimes|string|max:255'
                : 'required|string|max:255',

            'subtitle' => 'nullable|string|max:255',

            'slug' => $isUpdate
                ? 'sometimes|string|max:255'
                : 'required|string|max:255',

            'description' => $isUpdate
                ? 'sometimes|string'
                : 'required|string',

            'how_to_play' => $isUpdate
                ? 'sometimes|string'
                : 'required|string',

            'min_players' => 'nullable|integer|min:1',
            'max_players' => 'nullable|integer|gte:min_players',

            'duration' => 'nullable|integer',
        ];
    }
}
