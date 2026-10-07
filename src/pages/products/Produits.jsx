import { useEffect, useState } from 'react'
import axios from 'axios'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Header } from '@/layouts/header'
import { Main } from '@/layouts/main'

import Pagination from '@mui/material/Pagination'

import { ProduitSheet } from './components/ProduitSheet'

import './Produits.css'
import DeleteConfirmation from './components/DeleteConfirmation'

export function Produits() {

  // ==========================================
  // Produits
  // ==========================================

  const [produits, setProduits] = useState([])

  // ==========================================
  // Panneau latéral (ajout / modification)
  // ==========================================

  // panneau ouvert ou fermé
  const [sheetOpen, setSheetOpen] = useState(false)
  // delete ouvert ou fermé
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  // Stocker le nom et le id  quand on clique sur supprimer
  const [productToDelete, setProductToDelete] = useState(null)
  const [productNameToDelete, setProductNameToDelete] = useState("")
  // produit en cours de modification (null = création)
  const [currentProduct, setCurrentProduct] = useState(null)

  // ==========================================
  // Pagination
  // ==========================================

  const [pagination, setPagination] = useState({
    currentPage: 1,
    productsPerPage: 12,
    totalProducts: 0,
    totalPages: 0,
  })

  // ==========================================
  // Récupération des produits
  // ==========================================

  const getProducts = async (page = 1) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/products?page=${page}&limit=${pagination.productsPerPage}`
      )

      setProduits(response.data.data || [])

      setPagination(
        response.data.pagination || {
          currentPage: page,
          productsPerPage: pagination.productsPerPage,
          totalProducts: 0,
          totalPages: 0,
        }
      )
    } catch (error) {

      toast.error("Impossible de récupérer les produits.")
    }
  }

  // ==========================================
  // Changement de page
  // ==========================================

  const PaginateProductPage = (event, page) => {

    getProducts(page)

  }

  // ==========================================
  // Chargement initial
  // ==========================================

  useEffect(() => {

    getProducts(1)

  }, [])

  // ==========================================
  // Ajouter un produit
  // ==========================================

  const openCreate = () => {

    setCurrentProduct(null)
    setSheetOpen(true)

  }

  // ==========================================
  // Modifier un produit
  // ==========================================

  const openEdit = (product) => {

    setCurrentProduct(product)
    setSheetOpen(true)

  }

  // ==========================================
  // Enregistrer (appelé par le panneau quand on clique sur "Enregistrer")
  // ==========================================

  const handleSave = (data) => {

    if (currentProduct) {
      setProduits(
        produits.map((p) =>
          p._id === currentProduct._id ? { ...p, titre: data.title } : p
        )
      )
      toast.success('Produit modifié.')
    } else {
      setProduits([...produits, { _id: Date.now(), titre: data.title }])
      toast.success('Produit ajouté.')
    }

    setSheetOpen(false)

  }

  // ==========================================
  // Supprimer un produit
  // ==========================================
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://localhost:5001/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      )
      getProducts(),
        setDeleteDialogOpen(false)
    } catch (error) {


      toast.error("Impossible de supprimer le produit.")
    }
  }


  return (

    <>

      <Header />

      <Main>

        {/* ==========================================
            Titre + bouton
        ========================================== */}

        <div className="produits__top">

          <div>

            <h1 className="produits__title">
              Produits
            </h1>

            <p className="produits__subtitle">
              Voici la liste de vos produits.
            </p>

          </div>

          <Button onClick={openCreate}>

            <Plus />

            Ajouter un produit

          </Button>

        </div>


        {/* ==========================================
            Tableau
        ========================================== */}

        <div className="produits__table">

          <Table>

            <TableHeader>

              <TableRow>

                <TableHead>
                  Image
                </TableHead>

                <TableHead>
                  Titre
                </TableHead>

                <TableHead>
                  Référence
                </TableHead>

                <TableHead>
                  Marque
                </TableHead>

                <TableHead>
                  Catégorie
                </TableHead>

                <TableHead className="produits__actions">
                  Actions
                </TableHead>

              </TableRow>

            </TableHeader>


            <TableBody>

              {/* Aucun produit */}

              {produits.length === 0 && (

                <TableRow>

                  <TableCell
                    colSpan={6}
                    className="produits__empty"
                  >
                    Aucun produit.
                  </TableCell>

                </TableRow>

              )}


              {/* Produits */}

              {produits.map((p) => (

                <TableRow key={p._id}>

                  {/* Image */}

                  <TableCell>

                    {p.image ? (

                      <img
                        src={p.image}
                        alt={p.titre}
                        className="produit__image"
                      />

                    ) : (

                      <span>
                        Pas d'image
                      </span>

                    )}

                  </TableCell>


                  {/* Titre */}

                  <TableCell>
                    {p.titre}
                  </TableCell>


                  {/* Référence */}

                  <TableCell>
                    {p.reference}
                  </TableCell>


                  {/* Marque */}

                  <TableCell>
                    {p.brandId?.name || '-'}
                  </TableCell>


                  {/* Catégorie */}

                  <TableCell>
                    {p.categoryId?.name || '-'}
                  </TableCell>


                  {/* Actions */}

                  <TableCell className="produits__actions">

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(p)}
                      aria-label="Modifier"
                    >
                      <Pencil />
                    </Button>
                    {/* ICONE SUPPRIMER  */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setProductToDelete(p._id) // je garde ID de la marque
                        setProductNameToDelete(p.titre)// je garde nom de la marque 
                        setDeleteDialogOpen(true) // la boite est en etat ouvert
                      }}
                      aria-label="Supprimer"
                    >
                      <Trash2 />
                    </Button>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>

        </div>


        {/* ==========================================
            Pagination
        ========================================== */}

        {pagination.totalPages > 1 && (

          <div className="produitback-pagination">

            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={PaginateProductPage}
              color="primary"
            />

          </div>

        )}

      </Main>


      {/* ==========================================
          Panneau latéral (ajout / modification)
      ========================================== */}

      <ProduitSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        produits={
          currentProduct && {
            ...currentProduct,
            id: currentProduct._id,
            title: currentProduct.titre,
          }
        }
        onSave={handleSave}
      />

      {/* Panneau DE SUPPRESION */}
      < DeleteConfirmation
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => handleDelete(productToDelete)}
        productName={productNameToDelete} // envoyer le nom de la marque comme prop
      />

    </>

  )
}