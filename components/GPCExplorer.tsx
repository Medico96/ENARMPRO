"use client";

import { useState } from "react";
import { GPC_DATABASE, searchGPC, getTopGPC } from "@/lib/data/gpc-dgmoss";
import { Search, ExternalLink } from "lucide-react";

export default function GPCExplorer() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(getTopGPC(20));

  const handleSearch = (value: string) => {
    setQuery(value);
    if (value.trim()) {
      setResults(searchGPC(value));
    } else {
      setResults(getTopGPC(20));
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          type="text"
          placeholder="Buscar GPC... (ej: diabetes, preeclampsia, neumonía)"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-bg-card border border-border rounded-xl pl-12 pr-4 py-4 text-text-primary placeholder:text-text-dim focus:border-accent-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Results */}
      <div className="space-y-2">
        {results.length === 0 ? (
          <div className="text-center py-12 text-text-muted">
            No se encontraron resultados
          </div>
        ) : (
          results.map((gpc) => (
            <div
              key={gpc.code}
              className="bg-bg-card border border-border rounded-xl p-6 hover:border-accent-primary/30 transition-all group"
            >
              <div className="flex items-start gap-4">
                {/* Rank */}
                <div className="w-10 h-10 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-bold text-white text-sm">
                    {gpc.rank}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-gradient transition-colors">
                    {gpc.title}
                  </h3>
                  <p className="text-text-dim text-xs font-mono mb-2">
                    {gpc.code}
                  </p>
                  {gpc.description && (
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {gpc.description}
                    </p>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      gpc.frequency === "ALTA"
                        ? "bg-red-500/15 text-red-400"
                        : gpc.frequency === "MEDIA"
                        ? "bg-yellow-500/15 text-yellow-400"
                        : "bg-gray-500/15 text-gray-400"
                    }`}
                  >
                    {gpc.frequency}
                  </span>
                  <span className="text-text-muted text-xs">{gpc.year}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
