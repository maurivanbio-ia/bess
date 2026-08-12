import React, { useState, useEffect, useRef } from 'react';
import { BESSProject } from '../data/bessData';
import { 
  Download, 
  Layers, 
  Compass, 
  Info,
  CheckCircle,
  Building2,
  ZoomIn
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface GeoportalProps {
  projects: BESSProject[];
}

export const Geoportal: React.FC<GeoportalProps> = ({ projects }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('satellite');

  const mapInstanceRef = useRef<L.Map | null>(null);
  const streetTileRef = useRef<L.TileLayer | null>(null);
  const satelliteTileRef = useRef<L.TileLayer | null>(null);
  const polygonGroupRef = useRef<L.LayerGroup | null>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const totalAreaHa = projects.reduce((acc, p) => acc + (p.areaHectares || 0), 0);
  const totalAreaM2 = projects.reduce((acc, p) => acc + (p.areaM2 || 0), 0);

  // 1. Initialize Leaflet Map ONCE on mount
  useEffect(() => {
    const mapContainer = document.getElementById('geoportal-map-container');
    if (!mapContainer) return;

    if ((mapContainer as any)._leaflet_id) {
      (mapContainer as any)._leaflet_id = null;
    }

    const map = L.map('geoportal-map-container', {
      center: [-14.235, -51.925],
      zoom: 4,
      zoomControl: true,
    });

    const streetTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors | Brasol x EcoBrasil BESS Geoportal',
      maxZoom: 19,
    });

    const satelliteTile = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri World Imagery | Brasol x EcoBrasil BESS Geoportal',
      maxZoom: 18,
    });

    satelliteTile.addTo(map);

    streetTileRef.current = streetTile;
    satelliteTileRef.current = satelliteTile;
    polygonGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Handle mapType switch without destroying map instance
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !streetTileRef.current || !satelliteTileRef.current) return;

    if (mapType === 'satellite') {
      if (map.hasLayer(streetTileRef.current)) {
        map.removeLayer(streetTileRef.current);
      }
      if (!map.hasLayer(satelliteTileRef.current)) {
        map.addLayer(satelliteTileRef.current);
      }
    } else {
      if (map.hasLayer(satelliteTileRef.current)) {
        map.removeLayer(satelliteTileRef.current);
      }
      if (!map.hasLayer(streetTileRef.current)) {
        map.addLayer(streetTileRef.current);
      }
    }
  }, [mapType]);

  // 3. Render Polygons, Markers & Perform Automatic Zoom to Selected Project
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = polygonGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    const bounds = L.latLngBounds([]);
    let selectedLayer: L.Polygon | L.CircleMarker | null = null;

    projects.forEach(proj => {
      if (!proj.centerCoordinates) return;

      const isSelected = proj.id === selectedProjectId;
      const strokeColor = proj.statusCategoria === 'Cancelado' 
        ? '#ef4444' 
        : proj.statusCategoria === 'Dispensa Emitida' 
          ? '#059669' 
          : '#0284c7';

      // Polygon
      if (proj.polygonCoordinates && proj.polygonCoordinates.length > 2) {
        const polygon = L.polygon(proj.polygonCoordinates, {
          color: strokeColor,
          weight: isSelected ? 4 : 2,
          fillColor: strokeColor,
          fillOpacity: isSelected ? 0.55 : 0.25,
        });

        const popupContent = `
          <div style="font-family: Inter, sans-serif; padding: 4px;">
            <strong style="font-size: 14px; color: #0f172a;">${proj.nome}</strong><br/>
            <span style="font-size: 12px; color: #475569;">Órgão Licenciador: <b>${proj.orgaoLicenciador}</b></span><br/>
            <span style="font-size: 12px; color: #475569;">Área: <b style="color: #059669;">${proj.areaHectares ? proj.areaHectares + ' ha' : 'N/A'}</b> (${proj.potenciaMWp || 0} MWp)</span><br/>
            <span style="font-size: 11px; color: #0284c7; font-weight: bold;">CUOS: ${proj.cuosStatus.substring(0, 35)}...</span>
          </div>
        `;
        polygon.bindPopup(popupContent);

        polygon.on('click', () => {
          setSelectedProjectId(proj.id);
        });

        group.addLayer(polygon);
        bounds.extend(polygon.getBounds());

        if (isSelected) {
          selectedLayer = polygon;
        }
      } else {
        const marker = L.circleMarker(proj.centerCoordinates, {
          radius: isSelected ? 10 : 7,
          color: strokeColor,
          fillColor: strokeColor,
          fillOpacity: 0.8,
        });

        marker.bindPopup(`<b>${proj.nome}</b><br/>Área: ${proj.areaHectares || 0} ha`);
        group.addLayer(marker);
        bounds.extend(proj.centerCoordinates);

        if (isSelected) {
          selectedLayer = marker;
        }
      }
    });

    // Automatic Zoom Fit Bounds / FlyTo Selected Project
    if (selectedProject?.polygonCoordinates && selectedProject.polygonCoordinates.length > 2) {
      const polyBounds = L.polygon(selectedProject.polygonCoordinates).getBounds();
      map.fitBounds(polyBounds, { padding: [70, 70], maxZoom: 16, animate: true });
      if (selectedLayer) {
        selectedLayer.openPopup();
      }
    } else if (selectedProject?.centerCoordinates) {
      map.flyTo(selectedProject.centerCoordinates, 15, { duration: 0.8 });
      if (selectedLayer) {
        selectedLayer.openPopup();
      }
    } else if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [projects, selectedProjectId]);

  const handleDownloadKmz = (proj: BESSProject) => {
    if (!proj.kmzFileName) return;
    const link = document.createElement('a');
    link.href = `/kmz/${encodeURIComponent(proj.kmzFileName)}`;
    link.download = proj.kmzFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectAndZoom = (projId: string) => {
    setSelectedProjectId(projId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Info Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={22} style={{ color: 'var(--brasol-teal)' }} />
            Geoportal de Projetos BESS (Arquivos KMZ / KML Georeferenciados)
          </h2>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Clique em qualquer empreendimento na lista para realizar <strong>zoom automático no polígono no mapa</strong>.
          </p>
        </div>

        {/* Spatial Stats Badges */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--bg-main)', padding: '0.5rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Área Total Mapeada</span>
            <strong style={{ fontSize: '1.05rem', color: 'var(--ecobrasil-green)' }}>{totalAreaHa.toFixed(1)} ha</strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginLeft: '0.35rem' }}>({(totalAreaM2 / 1000).toLocaleString('pt-BR')} mil m²)</span>
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '0.5rem 0.9rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Camadas KMZ / KML</span>
            <strong style={{ fontSize: '1.05rem', color: 'var(--brasol-teal)' }}>{projects.filter(p => p.kmzFileName).length} Arquivos GIS</strong>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar List + Leaflet Map */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.5rem', minHeight: '600px' }}>
        
        {/* Spatial Sidebar List */}
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '680px', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ZoomIn size={16} style={{ color: 'var(--brasol-teal)' }} />
            Empreendimentos (Clique p/ Zoom)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {projects.map(proj => {
              const isSelected = proj.id === selectedProjectId;
              return (
                <div
                  key={proj.id}
                  onClick={() => handleSelectAndZoom(proj.id)}
                  style={{
                    padding: '0.9rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg-main)',
                    border: isSelected ? '2px solid var(--brasol-teal)' : '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.15)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <strong style={{ fontSize: '0.925rem', color: isSelected ? 'var(--brasol-teal)' : 'var(--text-primary)' }}>
                      {proj.nome}
                    </strong>
                    <span className="badge badge-blue" style={{ fontSize: '0.675rem' }}>{proj.uf}</span>
                  </div>

                  <div style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div>
                      <span>Tamanho da Área: </span>
                      <strong style={{ color: 'var(--ecobrasil-green)' }}>{proj.areaHectares ? `${proj.areaHectares} ha` : 'N/A'}</strong>
                      {proj.areaM2 && <span style={{ color: 'var(--text-muted)' }}> ({proj.areaM2.toLocaleString('pt-BR')} m²)</span>}
                    </div>

                    <div>
                      <span>Potência Estimada: </span>
                      <strong>{proj.potenciaMWp || '--'} MWp</strong>
                    </div>

                    <div style={{ marginTop: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className={`badge ${
                        proj.statusCategoria === 'Dispensa Emitida' ? 'badge-green' :
                        proj.statusCategoria === 'Cancelado' ? 'badge-red' : 'badge-amber'
                      }`} style={{ fontSize: '0.65rem' }}>
                        {proj.statusCategoria}
                      </span>

                      {proj.kmzFileName && (
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadKmz(proj);
                          }}
                          title="Baixar Arquivo KMZ/KML para Google Earth"
                        >
                          <Download size={12} /> KMZ
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Leaflet Map Display Container */}
        <div className="glass-panel" style={{ position: 'relative', minHeight: '600px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          
          {/* Layer Switcher Controls Overlay */}
          <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 1000, background: 'var(--bg-card)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', boxShadow: 'var(--shadow-md)' }}>
            <button
              type="button"
              className={`btn ${mapType === 'streets' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.35rem 0.7rem', fontSize: '0.775rem' }}
              onClick={() => setMapType('streets')}
            >
              <Layers size={13} /> Vetorial / Ruas
            </button>
            <button
              type="button"
              className={`btn ${mapType === 'satellite' ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.35rem 0.7rem', fontSize: '0.775rem' }}
              onClick={() => setMapType('satellite')}
            >
              <Layers size={13} /> Satélite (Esri)
            </button>
          </div>

          {/* Leaflet Map Div */}
          <div id="geoportal-map-container" style={{ width: '100%', height: '100%', minHeight: '600px' }} />

          {/* Selected Project Information Box Overlay (Bottom Left) */}
          {selectedProject && (
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', zIndex: 1000, background: 'var(--bg-header)', backdropFilter: 'blur(12px)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', boxShadow: 'var(--shadow-md)' }}>
              <div>
                <strong style={{ fontSize: '1rem', color: 'var(--brasol-teal)', display: 'block' }}>
                  {selectedProject.nome} ({selectedProject.orgaoLicenciador})
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Área do Empreendimento: <strong style={{ color: 'var(--ecobrasil-green)' }}>{selectedProject.areaHectares} hectares ({selectedProject.areaM2?.toLocaleString('pt-BR')} m²)</strong> • {selectedProject.potenciaMWp} MWp
                </span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  CUOS (Certidão de Uso e Ocupação do Solo): {selectedProject.cuosStatus}
                </p>
              </div>

              {selectedProject.kmzFileName && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleDownloadKmz(selectedProject)}
                >
                  <Download size={16} /> Baixar {selectedProject.kmzFileName}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
