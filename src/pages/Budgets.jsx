import { useState } from "react";
import { useApi } from "@/lib/useApi";
import { fetchBudgets, addBudget, updateBudget, deleteBudget } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const CATEGORY_COLORS = {
  Food: "bg-indigo-500",
  Transport: "bg-teal-500",
  Entertainment: "bg-amber-500",
  Shopping: "bg-orange-500",
  Health: "bg-pink-500",
  Utilities: "bg-emerald-500",
  Education: "bg-purple-500",
};

const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Health",
  "Utilities",
  "Education",
];
const EMPTY_FORM = { category: "", budget: "", spent: "" };

export default function Budgets() {
  const { data: budgets, loading, setData } = useApi(fetchBudgets);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const totalBudget = budgets
    ? budgets.reduce((sum, b) => sum + Number(b.budget), 0)
    : 0;
  const totalSpent = budgets
    ? budgets.reduce((sum, b) => sum + Number(b.spent), 0)
    : 0;
  const totalRemaining = totalBudget - totalSpent;

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(b) {
    setEditingId(b.id);
    setForm({ category: b.category, budget: b.budget, spent: b.spent });
    setOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        category: form.category,
        budget: Number(form.budget),
        spent: Number(form.spent),
      };
      if (editingId) {
        const updated = await updateBudget(editingId, payload);
        setData((prev) => prev.map((b) => (b.id === editingId ? updated : b)));
        toast.success("Budget updated!");
      } else {
        const added = await addBudget(payload);
        setData((prev) => [...prev, added]);
        toast.success("Budget added!");
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
      await deleteBudget(id);
      setData((prev) => prev.filter((b) => b.id !== id));
      toast.success("Budget deleted!");
    } catch (err) {
      toast.error("Failed to delete budget!");
      console.error(err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Budgets
        </h1>
        <Button
          className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          onClick={openAdd}
        >
          <Plus size={16} /> Add Budget
        </Button>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="dark:bg-slate-800 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              {editingId ? "Edit Budget" : "Add New Budget"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
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
                Budget Amount (PKR)
              </label>
              <Input
                type="number"
                placeholder="e.g. 10000"
                value={form.budget}
                onChange={(e) =>
                  setForm((p) => ({ ...p, budget: e.target.value }))
                }
                required
                className="dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:placeholder-slate-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Amount Spent (PKR)
              </label>
              <Input
                type="number"
                placeholder="e.g. 5000"
                value={form.spent}
                onChange={(e) =>
                  setForm((p) => ({ ...p, spent: e.target.value }))
                }
                required
                className="dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:placeholder-slate-400"
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
                  : "Add Budget"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Budget
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              PKR {totalBudget.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Total Spent
            </p>
            <p className="text-xl font-bold text-red-500">
              PKR {totalSpent.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Remaining
            </p>
            <p className="text-xl font-bold text-green-600">
              PKR {totalRemaining.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)
          : budgets?.map((b) => {
              const percent = Math.round(
                (Number(b.spent) / Number(b.budget)) * 100,
              );
              const remaining = Number(b.budget) - Number(b.spent);
              const isOver = percent > 100;
              const isWarning = percent >= 80 && percent <= 100;

              return (
                <Card
                  key={b.id}
                  className="dark:bg-slate-800 dark:border-slate-700"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${CATEGORY_COLORS[b.category] || "bg-slate-500"}`}
                        />
                        <CardTitle className="text-sm font-semibold text-slate-900 dark:text-white">
                          {b.category}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge
                          className={
                            isOver
                              ? "bg-red-100 text-red-700"
                              : isWarning
                                ? "bg-amber-100 text-amber-700"
                                : "bg-green-100 text-green-700"
                          }
                        >
                          {isOver
                            ? "Over budget"
                            : isWarning
                              ? "Almost full"
                              : "On track"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-blue-500 h-7 w-7"
                          onClick={() => openEdit(b)}
                        >
                          <Pencil size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-red-500 h-7 w-7"
                          onClick={() => handleDelete(b.id)}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Progress
                      value={Math.min(percent, 100)}
                      className={`h-2 ${isOver ? "bg-red-100" : "bg-slate-100"}`}
                    />
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>PKR {Number(b.spent).toLocaleString()} spent</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 dark:text-slate-500">
                        Budget: PKR {Number(b.budget).toLocaleString()}
                      </span>
                      <span
                        className={
                          remaining < 0
                            ? "text-red-500 font-medium"
                            : "text-green-600 font-medium"
                        }
                      >
                        {remaining < 0 ? "-" : "+"}PKR{" "}
                        {Math.abs(remaining).toLocaleString()}{" "}
                        {remaining < 0 ? "over" : "left"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>
    </div>
  );
}
