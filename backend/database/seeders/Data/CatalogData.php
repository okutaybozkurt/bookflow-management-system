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

    /** [başlık, fiyat, stok, kapak dosyası (database/seeders/covers), isbn, yazar indeksi, kategori indeksi] */
    public const BOOKS = [
        ['1984', 45.90, 120, '9780451524935.png', '9780451524935', 0, 3],
        ['Clean Code', 210.00, 45, '9780132350884.png', '9780132350884', 1, 1],
        ['Atomik Alışkanlıklar', 120.00, 200, '9786052163115.png', '9786052163115', 2, 2],
        ['Fahrenheit 451', 65.00, 85, '9781451673319.png', '9781451673319', 3, 3],
        ['Sapiens', 95.00, 150, '9786052205532.png', '9786052205532', 5, 4],
        ['Harry Potter', 88.00, 60, '9780747532743.png', '9780747532743', 4, 3],
        ['Simyacı', 42.00, 300, '9789750726439.png', '9789750726439', 6, 0],
        ['Bir Ömür Nasıl Yaşanır?', 55.00, 180, '9786057635836.png', '9786057635836', 7, 4],
        ['İnsanın Anlam Arayışı', 48.00, 250, '9789755395269.png', '9789755395269', 8, 5],
        ['Böyle Söyledi Zerdüşt', 60.00, 110, '9786053606116.png', '9786053606116', 9, 6],
        ['Steve Jobs', 135.00, 90, '9786050904444.png', '9786050904444', 10, 7],
        ['Satranç', 25.00, 400, '9786053606115.png', '9786053606115', 11, 0],
        ['Kürk Mantolu Madonna', 35.00, 500, '9789753638029.png', '9789753638029', 12, 0],
        ['Suç ve Ceza', 75.00, 140, '9789750719387.png', '9789750719387', 13, 0],
        ['Kozmos', 115.00, 75, '9789752115118.png', '9789752115118', 14, 8],
    ];
}
