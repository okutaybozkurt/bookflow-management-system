<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/** Kitap ekleme (POST) ve güncelleme (PUT/PATCH) doğrulaması. */
class BookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $req = $this->isMethod('POST') ? 'required' : 'sometimes';
        $book = $this->route('book');

        return [
            'title' => [$req, 'string', 'max:255'],
            'isbn' => ['nullable', 'string', 'max:20',
                Rule::unique('books', 'isbn')->ignore($book?->id)->withoutTrashed()],
            'price' => [$req, 'numeric', 'min:0', 'max:99999999'],
            'stock' => [$req, 'integer', 'min:0', 'max:1000000'],
            'author_id' => [$req, 'integer', 'exists:authors,id'],
            'category_id' => [$req, 'integer', 'exists:categories,id'],
            'description' => ['nullable', 'string', 'max:5000'],
            'page_count' => ['nullable', 'integer', 'min:1', 'max:20000'],
            'published_year' => ['nullable', 'integer', 'min:1000', 'max:'.(date('Y') + 1)],
            'language' => ['sometimes', 'string', 'max:30'],
            'is_active' => ['sometimes', 'boolean'],
            'cover_image' => ['nullable', 'url', 'max:2048'],
            'cover' => ['nullable', 'image', 'max:2048'], // dosya yükleme (jpg/png/webp, en fazla 2 MB)
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Kitap adı zorunludur.',
            'isbn.unique' => 'Bu ISBN numarasına sahip bir kitap zaten mevcut.',
            'price.required' => 'Fiyat zorunludur.',
            'price.numeric' => 'Fiyat geçerli bir sayı olmalıdır.',
            'price.min' => 'Fiyat negatif olamaz.',
            'stock.required' => 'Stok zorunludur.',
            'stock.integer' => 'Stok tam sayı olmalıdır.',
            'stock.min' => 'Stok negatif olamaz.',
            'author_id.exists' => 'Seçilen yazar bulunamadı.',
            'category_id.exists' => 'Seçilen kategori bulunamadı.',
            'cover.image' => 'Kapak dosyası bir görsel olmalıdır.',
            'cover.max' => 'Kapak görseli en fazla 2 MB olabilir.',
        ];
    }
}
