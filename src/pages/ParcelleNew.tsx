// ...
import MapSizer from "@/components/MapSizer";
// ...

const [tifName] = useState("s2_Cocoa_ID_bssI9w_2024_01.tif");

// ...

<div className="grid gap-8 lg:grid-cols-2">
  {/* Form */}
  <Card> ... </Card>

  {/* Carte + masques + dessin */}
  <Card>
    <CardHeader>
      <CardTitle>Carte & masques</CardTitle>
      <CardDescription>
        Les couleurs proviennent du NDVI (client-side). Dessine la zone à enregistrer.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <MapSizer
        lat={lat}
        lon={lon}
        tifName={tifName}
        onPolygonGenerated={handlePolygonGenerated}
      />
      {generatedPolygon && (
        <p className="mt-4 text-sm">
          Surface détectée : <b>{(calculatedArea || 0).toFixed(2)} ha</b>
        </p>
      )}
    </CardContent>
  </Card>
</div>
