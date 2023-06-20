import { SheetList } from "./components/SheetList/SheetList"
import { SheetsProvider } from "./context/sheets-view.context"

export const SheetsView = () => {

    return (
        <SheetsProvider>
            <SheetList />
        </SheetsProvider>
    )
}