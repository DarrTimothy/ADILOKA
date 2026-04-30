<?php

namespace App\Http\Requests;

use Illuminate\Validation\Validator;
use App\Models\QuizOptions;

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
            'answers.*.question_id' => ['required', 'distinct', 'exists:quiz_question,id'],
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

    public function withValidator(Validator $validator)
    {
        $validator->after(function (Validator $validator) {

            $answers = collect($this->answers);

            foreach ($answers as $answer) {
                $questionId = $answer['question_id'];
                $optionId = $answer['option_id'];

                $valid = QuizOptions::where('id', $optionId)
                    ->where('quiz_question_id', $questionId)
                    ->exists();

                if (!$valid) {
                    $validator->errors()->add(
                        'answers',
                        "Option tidak valid untuk question_id {$questionId}"
                    );
                }
            }
        });
    }
}
