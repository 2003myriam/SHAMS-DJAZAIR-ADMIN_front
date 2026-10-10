// Panneau latéral (Sheet) qui s'ouvre pour modifier une commande.
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from '@/components/ui/sheet'
import { ORDER_STATUS, PAYMENT_STATUS } from './StatusBadge'
import '../../products/Produits.css'

const EMPTY_FORM = {
  status: 'pending',
  paymentStatus: 'pending',
  customer: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    company: '',
  },
}

// ne garder que les champs que le backend autorise à modifier
const toForm = (order) => ({
  status: order.status,
  paymentStatus: order.paymentStatus,
  customer: { ...EMPTY_FORM.customer, ...order.customer },
})

export function CommandeSheet({ open, onOpenChange, order, onSave }) {

  const [form, setForm] = useState(order ? toForm(order) : EMPTY_FORM)
  //Surveille la prop order a chaque changement
  useEffect(() => {
    setForm(order ? toForm(order) : EMPTY_FORM)
  }, [order])

  // modifier un champ du client
  const setCustomerField = (field, value) => {
    setForm({
      ...form,
      customer: {
        ...form.customer,
        [field]: value
      }
    })
  }

  // SOUMISSION DU FORMULAIRE
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")
      const { firstName, lastName, email, phone, address, company } = form.customer

      // MODIFICATION
      await axios.patch(
        `http://localhost:5001/orders/admin/${order._id}`,
        {
          status: form.status,
          paymentStatus: form.paymentStatus,
          customer: { firstName, lastName, email, phone, address, company }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      toast.success("Commande modifiée avec succès")
      onSave?.()
      onOpenChange(false)

    } catch (error) {
      toast.error(error.response?.data?.message || "Impossible de modifier la commande.")
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>

      <SheetContent className="produit-sheet">
        {/* header du formulaire  */}
        <SheetHeader className="produit-sheet__header">
          <SheetTitle>
            Modifier la commande {order ? `#${order.orderNumber}` : ''}
          </SheetTitle>

          <SheetDescription>
            Modifiez les informations puis cliquez sur Enregistrer.
          </SheetDescription>
        </SheetHeader>

        {/* formulaire ici */}
        <form id="commande-form" onSubmit={handleSubmit} className="produit-sheet__form">

          {/* ================= Statuts ================= */}
          <section className="produit-sheet__section">
            <h3 className="produit-sheet__section-title">Statuts</h3>

            <div className="produit-sheet__row">
              {/* ======== statut de la commande =========== */}
              <div className="produit-sheet__field">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm({ ...form, status: value })}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ORDER_STATUS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* ======== statut du paiement =========== */}
              <div className="produit-sheet__field">
                <Label htmlFor="paymentStatus">Paiement</Label>
                <Select
                  value={form.paymentStatus}
                  onValueChange={(value) => setForm({ ...form, paymentStatus: value })}
                >
                  <SelectTrigger id="paymentStatus" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PAYMENT_STATUS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <Separator />

          {/* ================= Client ================= */}
          <section className="produit-sheet__section">
            <h3 className="produit-sheet__section-title">Client</h3>

            <div className="produit-sheet__row">
              {/* ======== prénom =========== */}
              <div className="produit-sheet__field">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={form.customer.firstName}
                  onChange={(e) => setCustomerField('firstName', e.target.value)}
                  required
                />
              </div>
              {/* ======== nom =========== */}
              <div className="produit-sheet__field">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={form.customer.lastName}
                  onChange={(e) => setCustomerField('lastName', e.target.value)}
                  required
                />
              </div>
            </div>
            {/* ======== email =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.customer.email}
                onChange={(e) => setCustomerField('email', e.target.value)}
                required
              />
            </div>
            {/* ======== téléphone =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={form.customer.phone}
                onChange={(e) => setCustomerField('phone', e.target.value)}
                required
              />
            </div>
            {/* ======== adresse =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={form.customer.address}
                onChange={(e) => setCustomerField('address', e.target.value)}
              />
            </div>
            {/* ======== entreprise =========== */}
            <div className="produit-sheet__field">
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                value={form.customer.company}
                onChange={(e) => setCustomerField('company', e.target.value)}
              />
            </div>
          </section>

          <Separator />
        </form>

        {/* footer du formulaire  */}
        <SheetFooter className="produit-sheet__footer">
          <SheetClose asChild>
            <Button type="button" variant="outline" >Annuler</Button>
          </SheetClose>
          <Button type="submit" form="commande-form" >Enregistrer</Button>
        </SheetFooter>

      </SheetContent>

    </Sheet>
  )
}
