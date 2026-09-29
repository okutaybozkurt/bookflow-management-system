<?php

namespace Database\Seeders\Data;

/** İlk kurulumda vitrin boş kalmasın diye yüklenen başlangıç kitap kataloğu. */
class CatalogData
{
    public const CATEGORIES = [
        'Dünya Klasikleri',
        'Yazılım',
        'Kişisel Gelişim',
        'Bilim Kurgu',
        'Tarih',
        'Psikoloji',
        'Felsefe',
        'Biyografi',
        'Bilim',
    ];

    public const AUTHORS = [
        'George Orwell',
        'Robert C. Martin',
        'James Clear',
        'Ray Bradbury',
        'J.K. Rowling',
        'Yuval Noah Harari',
        'Paulo Coelho',
        'İlber Ortaylı',
        'Viktor E. Frankl',
        'Friedrich Nietzsche',
        'Walter Isaacson',
        'Stefan Zweig',
        'Sabahattin Ali',
        'Fyodor Dostoyevski',
        'Carl Sagan',
    ];

    /** [başlık, fiyat, stok, kapak, isbn, yazar indeksi, kategori indeksi] */
    public const BOOKS = [
        ['1984', 45.90, 120, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000', '9780451524935', 0, 3],
        ['Clean Code', 210.00, 45, 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000', '9780132350884', 1, 1],
        ['Atomik Alışkanlıklar', 120.00, 200, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000', '9786052163115', 2, 2],
        ['Fahrenheit 451', 65.00, 85, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000', '9781451673319', 3, 3],
        ['Sapiens', 95.00, 150, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000', '9786052205532', 5, 4],
        ['Harry Potter', 88.00, 60, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000', '9780747532743', 4, 3],
        ['Simyacı', 42.00, 300, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1000', '9789750726439', 6, 0],
        ['Bir Ömür Nasıl Yaşanır?', 55.00, 180, 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=1000', '9786057635836', 7, 4],
        ['İnsanın Anlam Arayışı', 48.00, 250, 'https://images.unsplash.com/photo-1474366521946-c3d4b507abf2?q=80&w=1000', '9789755395269', 8, 5],
        ['Böyle Söyledi Zerdüşt', 60.00, 110, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000', '9786053606116', 9, 6],
        ['Steve Jobs', 135.00, 90, 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=1000', '9786050904444', 10, 7],
        ['Satranç', 25.00, 400, 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=1000', '9786053606115', 11, 0],
        ['Kürk Mantolu Madonna', 35.00, 500, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1000', '9789753638029', 12, 0],
        ['Suç ve Ceza', 75.00, 140, 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1000', '9789750719387', 13, 0],
        ['Kozmos', 115.00, 75, 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000', '9789752115118', 14, 8],
    ];
}
