import { createContext, useContext, useState } from "react";

interface TodoContextType {
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {

    const [search, setSearch] = useState("");

    return (
        <TodoContext.Provider value={{ search, setSearch }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodoContext = () => {

    const context = useContext(TodoContext);

    if (!context) {
        throw new Error("useTodoContext must be used inside TodoProvider");
    }

    return context;
};