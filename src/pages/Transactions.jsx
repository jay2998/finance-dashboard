import { useState } from "react";
import { useApi } from "@/lib/useApi";
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

const CATEGORY_COLORS = {
  Food: "bg-indigo-100 text-indigo-700",
  Income: "bg-green-100 text-green-700",
  Transport: "bg-teal-100 text-teal-700",
  Shopping: "bg-orange-100 text-orange-700",
  Health: "bg-pink-100 text-pink-700",
  Utilities: "bg-emerald-100 text-emerald-700",
  Entertainment: "bg-amber-100 text-amber-700",
  Education: "bg-purple-100 text-purple-700",
};

const CATEGORIES = [
  "Income",
  "Food",
  "Transport",
  "Shopping",
  "Health",
  "Utilities",
  "Entertainment",
  "Education",
];
const EMPTY_FORM = { description: "", category: "", amount: "", date: "" };

export default function Transactions() {
  const { data: transactions, loading, setData } = useApi(fetchTransactions);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const categories = ["All", ...CATEGORIES];

  const filtered = transactions
    ? transactions.filter((t) => {
        if (!t.description || !t.category) return false;
        const matchSearch = t.description
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchCategory = category === "All" || t.category === category;
        return matchSearch && matchCategory;
      })
    : [];

  const totalIncome = filtered
    .filter((t) => Number(t.amount) > 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpenses = filtered
    .filter((t) => Number(t.amount) < 0)
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(t) {
    setEditingId(t.id);
    setForm({
      description: t.description,
      category: t.category,
      amount: Math.abs(Number(t.amount)),
      date: t.date,
    });
    setOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        description: form.description,
        category: form.category,
        amount:
          form.category === "Income"
            ? Math.abs(Number(form.amount))
            : -Math.abs(Number(form.amount)),
        date: form.date,
      };
      if (editingId) {
        const updated = await updateTransaction(editingId, payload);
        setData((prev) => prev.map((t) => (t.id === editingId ? updated : t)));
        toast.success("Transaction updated!");
      } else {
        const added = await addTransaction(payload);
        setData((prev) => [...prev, added]);
        toast.success("Transaction added!");
      }
      setForm(EMPTY_FORM);
      setOpen(false);
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTransaction(id);
      setData((prev) => prev.filter((t) => t.id !== id));
      toast.success("Transaction deleted!");
    } catch (err) {
      toast.error("Failed to delete transaction!");
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Transactions
        </h1>
        <Button
          className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          onClick={openAdd}
        >
          <Plus size={16} /> Add Transaction
        </Button>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="dark:bg-slate-800 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              {editingId ? "Edit Transaction" : "Add New Transaction"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Description
              </label>
              <Input
                placeholder="e.g. Grocery Store"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                required
                className="dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:placeholder-slate-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Category
              </label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
              >
                <SelectTrigger className="dark:bg-slate-700 dark:text-white dark:border-slate-600">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-700 dark:border-slate-600">
                  {CATEGORIES.map((c) => (
                    <SelectItem
                      key={c}
                      value={c}
                      className="dark:text-white dark:focus:bg-slate-600"
                    >
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Amount (PKR)
              </label>
              <Input
                type="number"
                placeholder="e.g. 5000"
                value={form.amount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: e.target.value }))
                }
                required
                className="dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:placeholder-slate-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Date
              </label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                required
                className="dark:bg-slate-700 dark:text-white dark:border-slate-600"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : editingId
                  ? "Save Changes"
                  : "Add Transaction"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Income
            </p>
            <p className="text-xl font-bold text-green-600">
              PKR {totalIncome.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Expenses
            </p>
            <p className="text-xl font-bold text-red-500">
              PKR {totalExpenses.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Search transactions..."
            className="pl-9 dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:placeholder-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48 dark:bg-slate-800 dark:text-white dark:border-slate-600">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="dark:bg-slate-700 dark:border-slate-600">
            {categories.map((c) => (
              <SelectItem
                key={c}
                value={c}
                className="dark:text-white dark:focus:bg-slate-600"
              >
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transactions list */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
            {loading ? "Loading..." : `${filtered.length} Transactions`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-14 rounded-lg" />
                ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-slate-400 py-8">
              No transactions found
            </p>
          ) : (
            <div className="space-y-2">
              {filtered.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-100 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${Number(t.amount) > 0 ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {t.description}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {t.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`text-xs ${CATEGORY_COLORS[t.category] || "bg-slate-100 text-slate-700"}`}
                    >
                      {t.category}
                    </Badge>
                    <span
                      className={`text-sm font-semibold min-w-24 text-right ${Number(t.amount) > 0 ? "text-green-600" : "text-red-500"}`}
                    >
                      {Number(t.amount) > 0 ? "+" : "-"}PKR{" "}
                      {Math.abs(Number(t.amount)).toLocaleString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-blue-500"
                      onClick={() => openEdit(t)}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-slate-400 hover:text-red-500"
                      onClick={() => handleDelete(t.id)}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
