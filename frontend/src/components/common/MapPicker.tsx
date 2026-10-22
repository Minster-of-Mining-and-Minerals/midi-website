"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Search, MapPin, Navigation, Compass, Loader2, Check, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { extractCoordinates, getGoogleMapsUrl } from "@/utils/mapUtils";
import "leaflet/dist/leaflet.css";

interface MapPickerProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    className?: string;
}

export default function MapPicker({
    value = "",
    onChange,
    label = "Pin Office Location on Map",
    className = "",
}: MapPickerProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);

    const initialCoords = extractCoordinates(value);
    const [coords, setCoords] = useState<{ lat: number; lng: number }>(initialCoords);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<{ name: string; lat: number; lng: number }[]>([]);

    // The map's click/drag handlers are bound once, so read the latest onChange through a ref
    const onChangeRef = useRef(onChange);
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    // Update position and trigger onChange with clean Google Maps URL
    const updatePosition = useCallback((newLat: number, newLng: number, panMap = false) => {
        setCoords({ lat: newLat, lng: newLng });
        const cleanUrl = getGoogleMapsUrl(`${newLat},${newLng}`);
        onChangeRef.current(cleanUrl);

        if (markerRef.current) {
            markerRef.current.setLatLng([newLat, newLng]);
            markerRef.current.setPopupContent(`
                <div style="font-family: sans-serif; text-align: center; padding: 4px;">
                    <strong style="color: #d97706; font-size: 13px;">Selected Office Pin</strong><br/>
                    <span style="font-size: 11px; color: #4b5563;">Lat: ${newLat.toFixed(5)}, Lng: ${newLng.toFixed(5)}</span><br/>
                    <a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; font-size: 11px; text-decoration: underline; display: inline-block; margin-top: 4px;">
                        Verify in Google Maps &rarr;
                    </a>
                </div>
            `);
        }
        if (panMap && mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([newLat, newLng], 16, { duration: 1.2 });
        }
    }, []);

    // Synchronize when value changes externally (e.g. from asynchronous API fetch)
    useEffect(() => {
        if (!value) return;
        const parsed = extractCoordinates(value);
        // If significantly different from current state, update
        if (Math.abs(parsed.lat - coords.lat) > 0.00001 || Math.abs(parsed.lng - coords.lng) > 0.00001) {
            setCoords(parsed);
            if (markerRef.current) {
                markerRef.current.setLatLng([parsed.lat, parsed.lng]);
            }
            if (mapInstanceRef.current) {
                mapInstanceRef.current.setView([parsed.lat, parsed.lng], 15);
            }
        }
    }, [value]);

    // Initialize Leaflet map
    useEffect(() => {
        let isMounted = true;

        const initMap = async () => {
            if (!mapContainerRef.current || mapInstanceRef.current) return;

            const L = (await import("leaflet")).default;

            if (!isMounted || !mapContainerRef.current) return;

            // Custom SVG Marker Icon. Leaflet positions it with iconAnchor, so the HTML must not
            // shift itself: the bottom of the stem (x 20, y 45) is the exact selected point.
            const customIcon = L.divIcon({
                className: "custom-leaflet-marker",
                html: `
                    <div style="width: 40px; display: flex; flex-direction: column; align-items: center; cursor: grab;">
                        <div style="background-color: #f59e0b; color: white; padding: 7px; border-radius: 9999px; box-shadow: 0 4px 10px rgba(0,0,0,0.35); border: 2.5px solid white; display: flex; align-items: center; justify-content: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
                                <circle cx="12" cy="10" r="3"/>
                            </svg>
                        </div>
                        <div style="width: 2px; height: 6px; background-color: #f59e0b;"></div>
                        <div style="width: 8px; height: 8px; margin-top: -4px; background-color: rgba(0,0,0,0.3); border-radius: 9999px; filter: blur(1px);"></div>
                    </div>
                `,
                // 39px circle + 6px stem = 45px to the tip; the shadow is centred on the tip
                iconSize: [40, 49],
                iconAnchor: [20, 45],
                popupAnchor: [0, -45],
            });

            // Initialize map instance
            const map = L.map(mapContainerRef.current, {
                center: [coords.lat, coords.lng],
                zoom: 15,
                scrollWheelZoom: "center",
            });

            // Add OpenStreetMap tile layer
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(map);

            // Add draggable marker
            const cleanUrl = getGoogleMapsUrl(`${coords.lat},${coords.lng}`);
            const marker = L.marker([coords.lat, coords.lng], {
                icon: customIcon,
                draggable: true,
            }).addTo(map);

            marker.bindPopup(`
                <div style="font-family: sans-serif; text-align: center; padding: 4px;">
                    <strong style="color: #d97706; font-size: 13px;">Selected Office Pin</strong><br/>
                    <span style="font-size: 11px; color: #4b5563;">Lat: ${coords.lat.toFixed(5)}, Lng: ${coords.lng.toFixed(5)}</span><br/>
                    <a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; font-size: 11px; text-decoration: underline; display: inline-block; margin-top: 4px;">
                        Verify in Google Maps &rarr;
                    </a>
                </div>
            `);

            marker.on("dragend", () => {
                const position = marker.getLatLng();
                updatePosition(position.lat, position.lng);
            });

            // Click map to reposition
            map.on("click", (e: any) => {
                const { lat, lng } = e.latlng;
                updatePosition(lat, lng);
            });

            mapInstanceRef.current = map;
            markerRef.current = marker;

            // Invalidate size after mount
            setTimeout(() => {
                map.invalidateSize();
            }, 300);
        };

        initMap();

        return () => {
            isMounted = false;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Search location via Nominatim API
    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setSearchError(null);
        setSearchResults([]);

        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
                    searchQuery + (searchQuery.toLowerCase().includes("ethiopia") ? "" : ", Ethiopia")
                )}`
            );
            const data = await res.json();

            if (data && data.length > 0) {
                const results = data.map((r: { display_name: string; lat: string; lon: string }) => ({
                    name: r.display_name as string,
                    lat: parseFloat(r.lat),
                    lng: parseFloat(r.lon),
                }));

                // Jump to the best match; list the others so the right place can be picked
                updatePosition(results[0].lat, results[0].lng, true);
                setSearchResults(results.length > 1 ? results : []);
                setSearchError(null);
            } else {
                setSearchError("No locations found. Try searching a different place or click the map directly.");
            }
        } catch (err) {
            console.error("Geocoding failed:", err);
            setSearchError("Failed to search location. Please pan or click the map directly.");
        } finally {
            setIsSearching(false);
        }
    };

    // Preset quick locations for Addis Ababa
    const presets = [
        { label: "Bole", lat: 9.0054, lng: 38.7844 },
        { label: "Kazanchis", lat: 9.0175, lng: 38.7695 },
        { label: "Gotera", lat: 8.9882, lng: 38.7612 },
        { label: "Piazza", lat: 9.0345, lng: 38.7516 },
    ];

    // Get user's current GPS position
    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            setSearchError("Geolocation is not supported by your browser.");
            return;
        }

        setIsSearching(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setIsSearching(false);
                updatePosition(pos.coords.latitude, pos.coords.longitude, true);
            },
            (err) => {
                setIsSearching(false);
                setSearchError("Could not access your location: " + err.message);
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    };

    const currentGoogleMapsUrl = getGoogleMapsUrl(`${coords.lat},${coords.lng}`);

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <Label className="font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-golden-dark" />
                    {label}
                </Label>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs text-gray-600 bg-gray-50">
                        Lat: {coords.lat.toFixed(6)}
                    </Badge>
                    <Badge variant="outline" className="font-mono text-xs text-gray-600 bg-gray-50">
                        Lng: {coords.lng.toFixed(6)}
                    </Badge>
                </div>
            </div>

            {/* Search and Shortcuts */}
            <div className="flex flex-wrap items-center gap-2">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2 min-w-[240px]">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search area (e.g. Bole, Addis Ababa)..."
                            className="pl-9 h-9 text-sm"
                        />
                    </div>
                    <Button
                        type="submit"
                        size="sm"
                        variant="secondary"
                        disabled={isSearching}
                        className="h-9 px-3 shrink-0"
                    >
                        {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
                    </Button>
                </form>

                <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleUseMyLocation}
                    disabled={isSearching}
                    className="h-9 gap-1.5 shrink-0 text-xs font-normal"
                >
                    <Navigation className="w-3.5 h-3.5 text-golden-dark" />
                    My Location
                </Button>

                {/* Preset Chips */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <Compass className="w-3.5 h-3.5 text-gray-400 hidden sm:inline" />
                    {presets.map((p) => (
                        <button
                            key={p.label}
                            type="button"
                            onClick={() => updatePosition(p.lat, p.lng, true)}
                            className="text-xs px-2.5 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {searchError && (
                <p className="text-xs text-amber-600 mt-1">{searchError}</p>
            )}

            {searchResults.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-100 text-xs">
                    <p className="px-3 py-1.5 text-gray-500">Several places match. Pick the right one:</p>
                    {searchResults.map((r, i) => {
                        const isSelected =
                            Math.abs(r.lat - coords.lat) < 0.00001 && Math.abs(r.lng - coords.lng) < 0.00001;
                        return (
                            <button
                                key={`${r.lat},${r.lng},${i}`}
                                type="button"
                                onClick={() => updatePosition(r.lat, r.lng, true)}
                                className={`w-full text-left px-3 py-2 flex items-start gap-2 hover:bg-amber-50 ${isSelected ? "bg-amber-50 font-medium text-amber-900" : "text-gray-700"}`}
                            >
                                <MapPin className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isSelected ? "text-golden-dark" : "text-gray-400"}`} />
                                <span className="line-clamp-2">{r.name}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Interactive Leaflet Map Box */}
            <div className="relative rounded-xl border border-gray-300 overflow-hidden shadow-inner bg-slate-100">
                <div
                    ref={mapContainerRef}
                    className="w-full h-[320px] z-0"
                    style={{ minHeight: "320px" }}
                />

                <div className="absolute bottom-2 left-2 z-[400] bg-white/95 backdrop-blur px-3 py-1.5 rounded-md border border-gray-200 text-xs text-gray-700 shadow-sm pointer-events-none">
                    💡 Click anywhere or drag the pin to set the exact office location.
                </div>
            </div>

            {/* URL Output & Direct Verification Button */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Google Maps Link (synchronized with public contact page):</span>
                    <a
                        href={currentGoogleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-golden-dark font-medium hover:underline"
                    >
                        <span>Test Pin in Google Maps</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <Input
                        readOnly
                        value={currentGoogleMapsUrl}
                        className="font-mono text-xs bg-gray-50 text-gray-600 h-8"
                    />
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 shrink-0 gap-1 text-xs">
                        <Check className="w-3 h-3" />
                        Valid Pin
                    </Badge>
                </div>
            </div>
        </div>
    );
}
