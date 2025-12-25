"use client";

import { ReactNode } from "react";
import { FiChevronLeft, FiChevronRight, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { AdminButton } from "./Button";
import { cn } from "@/lib/utils";

interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => ReactNode;
    sortable?: boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    pagination?: {
        page: number;
        pageSize: number;
        total: number;
        onPageChange: (page: number) => void;
    };
    sortable?: boolean;
}

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    onRowClick,
    pagination,
    sortable = true,
}: DataTableProps<T>) {
    const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 1;

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                                >
                                    <div className="flex items-center gap-2">
                                        {column.header}
                                        {sortable && column.sortable !== false && (
                                            <button className="p-1 hover:bg-gray-200 rounded">
                                                <FiChevronDown className="w-4 h-4 text-gray-400" />
                                            </button>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr
                                    key={index}
                                    onClick={() => onRowClick?.(item)}
                                    className={cn(
                                        "hover:bg-gray-50 transition-colors",
                                        onRowClick && "cursor-pointer"
                                    )}
                                >
                                    {columns.map((column) => (
                                        <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {column.render
                                                ? column.render(item)
                                                : item[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
                        {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
                        {pagination.total} results
                    </div>
                    <div className="flex items-center gap-2">
                        <AdminButton
                            variant="outline"
                            onClick={() => pagination.onPageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                        >
                            <FiChevronLeft className="w-4 h-4" />
                        </AdminButton>
                        <span className="px-4 py-2 text-sm text-gray-700">
                            Page {pagination.page} of {totalPages}
                        </span>
                        <AdminButton
                            variant="outline"
                            onClick={() => pagination.onPageChange(pagination.page + 1)}
                            disabled={pagination.page >= totalPages}
                        >
                            <FiChevronRight className="w-4 h-4" />
                        </AdminButton>
                    </div>
                </div>
            )}
        </div>
    );
}

