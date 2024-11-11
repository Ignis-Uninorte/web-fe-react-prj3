
type ColumnProps<T> = {
    name: string;
    selector?: (row: T) => string | number | boolean;
    sortable: boolean;
    cell?: (row: T) => JSX.Element | string;
};

interface ColumnConfigProps<T> {
    baseColumns: ColumnProps<T>[]; 
    customColumns?: ColumnProps<T>[]; 
}

const columnsConfig = <T,>({ baseColumns, customColumns = [] }: ColumnConfigProps<T>): ColumnProps<T>[] => {
    return [...baseColumns, ...customColumns];
};

export default columnsConfig;

