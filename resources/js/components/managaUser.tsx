"use client"

import * as React from "react"
import { Inertia } from "@inertiajs/inertia"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

export type UserItem = {
  id: number
  name: string
  email: string
}

export const ManageUserTable = ({ customers }: { customers: UserItem[] }) => {
  const [data, setData] = React.useState<UserItem[]>(customers)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [newName, setNewName] = React.useState("")
  const [newEmail, setNewEmail] = React.useState("")

  const [editUserId, setEditUserId] = React.useState<number | null>(null)
  const [editName, setEditName] = React.useState("")
  const [editEmail, setEditEmail] = React.useState("")

  // Table columns
  const columns: ColumnDef<UserItem>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) =>
        editUserId === row.original.id ? (
          <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
        ) : (
          row.getValue("name")
        ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
        </Button>
      ),
      cell: ({ row }) =>
        editUserId === row.original.id ? (
          <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
        ) : (
          row.getValue("email")
        ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original

        if (editUserId === user.id) {
          return (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  Inertia.put(`/manageUser/${user.id}`, { name: editName, email: editEmail }, {
                    onSuccess: () => {
                      setData((prev) =>
                        prev.map((u) =>
                          u.id === user.id ? { ...u, name: editName, email: editEmail } : u
                        )
                      )
                      setEditUserId(null)
                    },
                  })
                }}
              >
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditUserId(null)}>
                Cancel
              </Button>
            </div>
          )
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                ⋮
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setEditUserId(user.id)
                  setEditName(user.name)
                  setEditEmail(user.email)
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                    Inertia.delete(`/manageUser/${user.id}`, {
                      onSuccess: () => setData((prev) => prev.filter((u) => u.id !== user.id)),
                    })
                  }
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  })

  const handleAddCustomer = (e: React.FormEvent) => {
  e.preventDefault()

  Inertia.post(
    "/manageUser",
    { name: newName, email: newEmail },
    {
      onSuccess: (page) => {
        // Type assertion: tell TypeScript the shape of page.props
        const props = page.props as unknown as { customers: UserItem[] }

        // Add the newly created customer to the state
        setData((prev) => [...prev, props.customers[props.customers.length - 1]])

        // Reset input fields
        setNewName("")
        setNewEmail("")
      },
    }
  )
}


  return (
    <div className="w-full p-4">
      <form onSubmit={handleAddCustomer} className="mb-4 flex gap-2">
        <Input placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} required />
        <Input placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
        <Button type="submit">Add Customer</Button>
      </form>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-4">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
