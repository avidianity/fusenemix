<?php

namespace App\Http\Requests\V1\File;

use App\Enums\File\Type;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ImportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'path' => ['required', 'string', 'max:255'],
            'files' => ['required', 'array'],
            'files.*.path' => ['required', 'string', 'max:255'],
            'files.*.type' => ['required', 'string', 'max:255', Rule::in(Type::values())],
        ];
    }
}
