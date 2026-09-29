import { useCallback, useEffect, useState } from 'react'
import { errorMessage } from '../../api'
import { authorsApi, booksApi, categoriesApi } from '../../services'
import type { Author, Book, Category, UserRole } from '../types'

/**
 * Katalog verisi (kitap, kategori, yazar). Vitrin yalnızca aktif kitapları gösterir;
 * yönetici ayrıca pasif kitapları içeren `adminBooks` listesini alır.
 */
export function useData(userRole: UserRole, authReady: boolean) {
  const [books, setBooks] = useState<Book[]>([])
  const [adminBooks, setAdminBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState<string | null>(null)

  const refreshCatalog = useCallback(async () => {
    try {
      const [pub, cats, auths, all] = await Promise.all([
        booksApi.listPublic(),
        categoriesApi.list(),
        authorsApi.list(),
        userRole === 'admin' ? booksApi.listAdmin() : Promise.resolve([] as Book[]),
      ])
      setBooks(pub)
      setCategories(cats)
      setAuthors(auths)
      setAdminBooks(all)
      // Detay sayfasındaki kitap güncel veriyle eşitlenir.
      setSelectedBook((prev) => (prev ? pub.find((b) => b.id === prev.id) ?? prev : prev))
      setCatalogError(null)
    } catch (error) {
      setCatalogError(errorMessage(error, 'Kitaplar yüklenemedi.'))
    } finally {
      setCatalogLoading(false)
    }
  }, [userRole])

  useEffect(() => {
    if (authReady) refreshCatalog()
  }, [authReady, refreshCatalog])

  return {
    books, adminBooks, categories, authors, selectedBook, setSelectedBook,
    catalogLoading, catalogError, refreshCatalog,
  }
}
