<?php

namespace App\Http\Requests;

class SubmitQuizRequest extends RequestForm
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Jika answers dikirim sebagai string JSON (form-data), decode menjadi array
     */
    protected function prepareForValidation()
    {
        $answers = $this->input('answers');

        if (is_string($answers)) {
            $decoded = json_decode($answers, true);

            if (is_array($decoded)) {
                $this->merge(['answers' => $decoded]);
            }
        }
    }

    public function rules(): array
    {
        return [
            'answers' => ['required', 'array'],
            'answers.*.question_id' => ['required', 'exists:quiz_question,id'],
            'answers.*.option_id' => ['required', 'exists:quiz_options,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'answers.required' => 'Jawaban wajib dikirim',
            'answers.array' => 'Format jawaban tidak valid',
            'answers.*.question_id.required' => 'Question ID wajib diisi',
            'answers.*.option_id.required' => 'Option ID wajib diisi',
        ];
    }
}
