import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

const UNIT_OPTIONS = ["item", "m²", "lm", "m³", "hr", "%"];
const COST_TYPE_OPTIONS = [
  "Professional Fee",
  "Council/Statutory",
  "Supply & Install",
  "Material Supply",
  "Labour Only",
  "Equipment/Plant",
  "Contingency/Margin"
];

const COST_TYPE_COLORS: Record<string, string> = {
  "Professional Fee": "text-blue-600 dark:text-blue-400",
  "Council/Statutory": "text-amber-600 dark:text-amber-400",
  "Supply & Install": "text-purple-600 dark:text-purple-400",
  "Material Supply": "text-green-600 dark:text-green-400",
  "Labour Only": "text-orange-600 dark:text-orange-400",
  "Equipment/Plant": "text-cyan-600 dark:text-cyan-400",
  "Contingency/Margin": "text-slate-600 dark:text-slate-400"
};

export interface CostItem {
  id: string;
  category: string;
  item: string;
  units: string;
  quantity: number;
  rate: number;
  costType: string;
  cost: number;
  notes: string;
  citation?: string;
  isEdited: boolean;
  editedFields?: {
    quantity?: boolean;
    rate?: boolean;
    units?: boolean;
    costType?: boolean;
  };
  originalValues?: {
    quantity?: number;
    rate?: number;
    units?: string;
    costType?: string;
  };
}

interface CostingTableProps {
  items: CostItem[];
  onItemUpdate: (id: string, field: keyof CostItem, value: string | number) => void;
  onAddRow: (afterId: string) => void;
  onDeleteRow: (id: string) => void;
  onMoveRow: (id: string, direction: 'up' | 'down') => void;
}

export const CostingTable = ({ items, onItemUpdate, onAddRow, onDeleteRow, onMoveRow }: CostingTableProps) => {
  const [editingCell, setEditingCell] = useState<string | null>(null);

  const handleCellEdit = (id: string, field: keyof CostItem, value: string) => {
    if (field === "quantity" || field === "rate") {
      const numValue = parseFloat(value.replace(/[^0-9.-]/g, ""));
      if (!isNaN(numValue)) {
        onItemUpdate(id, field, numValue);
        // Auto-calculate cost when quantity or rate changes
        const item = items.find(i => i.id === id);
        if (item) {
          const newCost = field === "quantity" 
            ? numValue * item.rate 
            : item.quantity * numValue;
          // Always auto-calculate cost
          onItemUpdate(id, 'cost', newCost);
        }
      }
    } else {
      onItemUpdate(id, field, value);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryTotal = (category: string) => {
    return items
      .filter((item) => item.category === category)
      .reduce((sum, item) => sum + item.cost, 0);
  };

  const categories = Array.from(new Set(items.map((item) => item.category)));

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="w-full min-w-[1200px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[12%]">Stage / Category</TableHead>
            <TableHead className="w-[15%]">Item / Description</TableHead>
            <TableHead className="w-[6%]">Units</TableHead>
            <TableHead className="w-[8%]">Qty / Area</TableHead>
            <TableHead className="w-[8%]">Rate (AUD)</TableHead>
            <TableHead className="w-[10%]">Cost Type</TableHead>
            <TableHead className="w-[10%]">Est. Cost</TableHead>
            <TableHead className="w-[20%]">Notes / Commentary</TableHead>
            <TableHead className="w-[11%]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => {
            const categoryItems = items.filter((item) => item.category === category);
            return (
                <React.Fragment key={category}>
                {categoryItems.map((item, index) => (
                  <TableRow key={item.id}>
                    {index === 0 && (
                      <TableCell
                        rowSpan={categoryItems.length}
                        className="font-semibold align-top border-r"
                      >
                        {category}
                      </TableCell>
                    )}
                    <TableCell className="font-medium">{item.item}</TableCell>
                    <TableCell className={item.editedFields?.units ? "bg-green-100 dark:bg-green-900/30" : ""}>
                      <Select
                        value={item.units}
                        onValueChange={(value) => handleCellEdit(item.id, "units", value)}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {UNIT_OPTIONS.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className={item.editedFields?.quantity ? "bg-green-100 dark:bg-green-900/30" : ""}>
                      <input
                        value={item.quantity || ""}
                        onChange={(e) => handleCellEdit(item.id, "quantity", e.target.value)}
                        onFocus={() => setEditingCell(`${item.id}-quantity`)}
                        onBlur={() => setEditingCell(null)}
                        className="w-full h-8 px-2 text-sm text-right border rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        type="text"
                        inputMode="decimal"
                      />
                    </TableCell>
                    <TableCell className={item.editedFields?.rate ? "bg-green-100 dark:bg-green-900/30" : ""}>
                      <input
                        value={item.rate || ""}
                        onChange={(e) => handleCellEdit(item.id, "rate", e.target.value)}
                        onFocus={() => setEditingCell(`${item.id}-rate`)}
                        onBlur={() => setEditingCell(null)}
                        className="w-full h-8 px-2 text-sm text-right border rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        type="number"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell className={item.editedFields?.costType ? "bg-green-100 dark:bg-green-900/30" : ""}>
                      <Select
                        value={item.costType}
                        onValueChange={(value) => handleCellEdit(item.id, "costType", value)}
                      >
                        <SelectTrigger className={`h-8 text-sm ${COST_TYPE_COLORS[item.costType] || ""}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card z-50">
                          {COST_TYPE_OPTIONS.map((type) => (
                            <SelectItem key={type} value={type} className={COST_TYPE_COLORS[type]}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="h-8 px-2 py-1 text-sm font-mono bg-muted rounded-md flex items-center justify-end">
                        {formatCurrency(item.cost)}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.notes}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => onMoveRow(item.id, 'up')}
                          disabled={index === 0 && categories.indexOf(category) === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => onMoveRow(item.id, 'down')}
                          disabled={index === categoryItems.length - 1 && categories.indexOf(category) === categories.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => onAddRow(item.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => onDeleteRow(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={6} className="font-semibold text-right">
                    Subtotal {category}
                  </TableCell>
                  <TableCell className="font-bold">{formatCurrency(getCategoryTotal(category))}</TableCell>
                  <TableCell colSpan={2} />
                </TableRow>
              </React.Fragment>
            );
          })}
          <TableRow className="bg-primary/10">
            <TableCell colSpan={6} className="font-bold text-lg text-right">
              💰 GRAND TOTAL (incl. GST)
            </TableCell>
            <TableCell className="font-bold text-lg">
              {formatCurrency(items.reduce((sum, item) => sum + item.cost, 0))}
            </TableCell>
            <TableCell colSpan={2} />
          </TableRow>
        </TableBody>
      </Table>
      </div>
    </div>
  );
};
