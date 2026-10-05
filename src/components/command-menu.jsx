// Menu de recherche rapide (Ctrl+K) : aller à une page ou changer de thème.
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Laptop, Moon, Sun } from 'lucide-react'
import { useSearch } from '@/context/search-provider'
import { useTheme } from '@/context/theme-provider'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { MENU_ITEMS, MENU_ITEMS2 } from '@/layouts/data/sidebar-data'
import { ScrollArea } from '@/components/ui/scroll-area'

export function CommandMenu() {
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()

  const runCommand = React.useCallback(
    (command) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Tapez une commande ou recherchez...' />
      <CommandList>
        <ScrollArea type='hover' className='h-72 pe-1'>
          <CommandEmpty>Aucun résultat.</CommandEmpty>
          {MENU_ITEMS.map((group) => (
            <CommandGroup key={group.key} heading={group.label}>
              {MENU_ITEMS2.filter((item) => item.parent === group.key).map(
                (item) => (
                  <CommandItem
                    key={item.key}
                    value={`${group.label}-${item.label}`}
                    onSelect={() => {
                      runCommand(() => navigate(item.path))
                    }}
                  >
                    <div className='flex size-4 items-center justify-center'>
                      <ArrowRight className='size-2 text-muted-foreground/80' />
                    </div>
                    {item.label}
                  </CommandItem>
                )
              )}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading='Thème'>
            <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
              <Sun /> <span>Clair</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
              <Moon className='scale-90' />
              <span>Sombre</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme('system'))}>
              <Laptop />
              <span>Système</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
