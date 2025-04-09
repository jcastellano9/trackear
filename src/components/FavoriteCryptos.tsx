
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Star, Plus, X } from "lucide-react";
import { defaultFavoriteCryptos, cryptoOptions } from "@/utils/investmentOptions";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function FavoriteCryptos() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableCryptos, setAvailableCryptos] = useState<any[]>([]);

  useEffect(() => {
    // Simulate API call
    const fetchData = () => {
      setTimeout(() => {
        // In a real app, this would come from user preferences
        const storedFavorites = localStorage.getItem("favoriteCryptos");
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        } else {
          // Use defaults
          const enrichedDefaults = defaultFavoriteCryptos.map(crypto => ({
            ...crypto,
            price: crypto.value === "USDT" ? 950 : crypto.value === "DAI" ? 970 : 960,
            change24h: crypto.value === "USDT" ? 0.5 : crypto.value === "DAI" ? -0.2 : 0.8
          }));
          setFavorites(enrichedDefaults);
          localStorage.setItem("favoriteCryptos", JSON.stringify(enrichedDefaults));
        }
        setLoading(false);
      }, 800);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter out already favorited cryptos
    const favoritesValues = favorites.map(f => f.value);
    setAvailableCryptos(
      cryptoOptions
        .filter(crypto => !favoritesValues.includes(crypto.value))
        .map(crypto => ({
          ...crypto,
          price: Math.floor(Math.random() * 1000) + 800,
          change24h: (Math.random() * 5 * (Math.random() > 0.5 ? 1 : -1)).toFixed(2)
        }))
    );
  }, [favorites]);

  const addToFavorites = (crypto: any) => {
    if (favorites.length >= 5) {
      toast.error("Puedes tener hasta 5 criptomonedas favoritas");
      return;
    }
    
    const updatedFavorites = [...favorites, crypto];
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteCryptos", JSON.stringify(updatedFavorites));
    toast.success(`${crypto.name} agregada a favoritos`);
  };

  const removeFromFavorites = (cryptoValue: string) => {
    const updatedFavorites = favorites.filter(c => c.value !== cryptoValue);
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteCryptos", JSON.stringify(updatedFavorites));
    toast.success("Criptomoneda eliminada de favoritos");
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Cripto Favoritas</CardTitle>
            <CardDescription>Tus criptomonedas preferidas a la vista</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={favorites.length >= 5}>
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar criptomoneda a favoritos</DialogTitle>
                <DialogDescription>
                  Puedes agregar hasta 5 criptomonedas a tu lista de favoritos
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto py-2">
                {availableCryptos.map((crypto) => (
                  <div key={crypto.value} className="flex items-center justify-between p-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={crypto.logo} alt={crypto.name} />
                        <AvatarFallback>{crypto.value.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{crypto.name}</p>
                        <p className="text-xs text-muted-foreground">{crypto.value}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => addToFavorites(crypto)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cerrar</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2 animate-pulse">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="h-14 bg-muted rounded-md" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {favorites.map((crypto) => (
              <div key={crypto.value} className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={crypto.logo} alt={crypto.name} />
                    <AvatarFallback>{crypto.value.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{crypto.name}</p>
                    <p className="text-xs text-muted-foreground">{crypto.value}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-medium">$ {crypto.price.toLocaleString('es-AR')}</p>
                  <Badge variant={Number(crypto.change24h) >= 0 ? "default" : "destructive"} className="flex items-center">
                    {Number(crypto.change24h) >= 0 ? 
                      <ArrowUp className="mr-1 h-3 w-3" /> : 
                      <ArrowDown className="mr-1 h-3 w-3" />}
                    {Math.abs(Number(crypto.change24h)).toFixed(2)}%
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-2 text-muted-foreground hover:text-destructive"
                  onClick={() => removeFromFavorites(crypto.value)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {favorites.length === 0 && (
              <div className="text-center p-4 text-muted-foreground">
                <p>No tienes criptomonedas favoritas</p>
                <p className="text-sm">Agrega algunas para ver su cotización aquí</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
