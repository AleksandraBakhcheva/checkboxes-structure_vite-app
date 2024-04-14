import { useForm, FormProvider } from "react-hook-form";
import { Header } from "./components/Header/Header";
import { HomePage } from "./pages/HomePage/HomePage";
import { Footer } from "./components/Footer/Footer";

function App() {
  const form = useForm();

  return (
    <>
      <Header />
      <main>
        <FormProvider {...form}>
          <HomePage />
        </FormProvider>
      </main>
      <Footer />
    </>
  );
}

export default App;
