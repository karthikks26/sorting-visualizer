import SortingVisualizer from "@/components/ui/SortingVisualizer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Sorting Algorithm Visualizer</h1>
      <SortingVisualizer />
    </main>
  );
}
