/**
 * Horizontal filter bar – ported from horizontal-filter-component/components/filter-bar.tsx.
 * Matches the reference design: search input, States / Risk / Share Price dropdowns,
 * clear all, and active filter chips. Uses TrustEze theme (theme/colors, muiFilterTheme).
 */
import React, { useState, useCallback, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import { SearchFilters as SearchFiltersType, SearchFilterRiskLevel } from "../types";
import { colors } from "../theme/colors";
import { filterBarTheme } from "../theme/muiFilterTheme";
import { US_STATES } from "../data/usStates";
import "./SearchFilters.css";

// Display labels for risk (reference uses "High" | "Medium" | "Low")
const RISK_DISPLAY: Record<SearchFilterRiskLevel, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};
const RISK_OPTIONS: SearchFilterRiskLevel[] = ["high", "medium", "low"];

const RISK_CHIP_COLORS: Record<SearchFilterRiskLevel, { bg: string; text: string }> = {
  high: { bg: "#fef2f2", text: "#dc2626" },
  medium: { bg: "#fff7ed", text: "#ea580c" },
  low: { bg: "#f0fdf4", text: "#16a34a" },
};

function filtersToBar(filters: SearchFiltersType) {
  return {
    search: filters.keyword ?? "",
    states: filters.states ?? [],
    risk: filters.riskLevels ?? [],
    sharePriceMin: filters.minPrice != null ? String(filters.minPrice) : "",
    sharePriceMax: filters.maxPrice != null ? String(filters.maxPrice) : "",
  };
}

function barToFilters(
  bar: ReturnType<typeof filtersToBar>,
  prev: SearchFiltersType
): SearchFiltersType {
  return {
    ...prev,
    keyword: bar.search || undefined,
    states: bar.states.length > 0 ? bar.states : undefined,
    riskLevels: bar.risk.length > 0 ? bar.risk : undefined,
    minPrice: bar.sharePriceMin ? Number(bar.sharePriceMin) : undefined,
    maxPrice: bar.sharePriceMax ? Number(bar.sharePriceMax) : undefined,
  };
}

const popoverProps = {
  anchorOrigin: { vertical: "bottom" as const, horizontal: "left" as const },
  transformOrigin: { vertical: "top" as const, horizontal: "left" as const },
  slotProps: {
    paper: {
      sx: {
        mt: 1,
        borderRadius: 2,
        boxShadow:
          "0 4px 6px -1px rgba(0,0,0,0.07), 0 10px 15px -3px rgba(0,0,0,0.07)",
        border: "1px solid #e8e0d8",
      },
    },
  },
};

export interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  onSearch: () => void;
  onClear: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClear,
}) => {
  const [stateAnchor, setStateAnchor] = useState<HTMLElement | null>(null);
  const [riskAnchor, setRiskAnchor] = useState<HTMLElement | null>(null);
  const [priceAnchor, setPriceAnchor] = useState<HTMLElement | null>(null);
  const [stateSearch, setStateSearch] = useState("");

  const bar = useMemo(() => filtersToBar(filters), [filters]);

  const filteredStates = useMemo(
    () =>
      US_STATES.filter((s) =>
        s.toLowerCase().includes(stateSearch.toLowerCase())
      ),
    [stateSearch]
  );

  const updateBar = useCallback(
    (next: Partial<ReturnType<typeof filtersToBar>>) => {
      onFiltersChange(barToFilters({ ...bar, ...next }, filters));
    },
    [bar, filters, onFiltersChange]
  );

  const handleStateToggle = useCallback(
    (state: string) => {
      const next = bar.states.includes(state)
        ? bar.states.filter((s) => s !== state)
        : [...bar.states, state];
      updateBar({ states: next });
    },
    [bar, updateBar]
  );

  const handleRiskToggle = useCallback(
    (risk: SearchFilterRiskLevel) => {
      const next = bar.risk.includes(risk)
        ? bar.risk.filter((r) => r !== risk)
        : [...bar.risk, risk];
      updateBar({ risk: next });
    },
    [bar, updateBar]
  );

  const activeFilterCount =
    bar.states.length +
    bar.risk.length +
    (bar.sharePriceMin ? 1 : 0) +
    (bar.sharePriceMax ? 1 : 0);

  const handleClearAll = () => {
    onFiltersChange({
      ...filters,
      keyword: undefined,
      states: undefined,
      riskLevels: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
    onClear();
  };

  return (
    <ThemeProvider theme={filterBarTheme}>
      <Box
        className="search-filters-bar"
        sx={{
          width: "100%",
          bgcolor: "#ffffff",
          border: "1px solid #e8e0d8",
          borderRadius: 3,
          px: 3,
          py: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {/* Main filter row */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          {/* Search bar */}
          <TextField
            size="small"
            placeholder="Search..."
            value={bar.search}
            onChange={(e) => updateBar({ search: e.target.value })}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{ color: colors.primary, fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
                sx: {
                  bgcolor: "#faf8f5",
                  fontSize: 14,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: colors.primary,
                  },
                },
              },
            }}
            sx={{ minWidth: 220, flex: "1 1 220px", maxWidth: 320 }}
          />

          <Divider
            orientation="vertical"
            flexItem
            sx={{ mx: 0.5, borderColor: "#e8e0d8" }}
          />

          {/* States filter button */}
          <Button
            variant="outlined"
            size="small"
            onClick={(e) => setStateAnchor(e.currentTarget)}
            startIcon={
              <LocationOnOutlinedIcon
                sx={{ fontSize: 18, color: colors.primary }}
              />
            }
            endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
            sx={{
              borderColor: bar.states.length > 0 ? colors.primary : "#d4ccc0",
              color: bar.states.length > 0 ? colors.primary : "#6b6560",
              bgcolor:
                bar.states.length > 0 ? "rgba(139,115,85,0.06)" : "transparent",
              px: 2,
              py: 0.75,
              fontSize: 13,
              fontWeight: 500,
              "&:hover": {
                borderColor: colors.primary,
                bgcolor: "rgba(139,115,85,0.08)",
              },
            }}
          >
            States
            {bar.states.length > 0 && (
              <Chip
                label={bar.states.length}
                size="small"
                sx={{
                  ml: 0.75,
                  height: 20,
                  minWidth: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  bgcolor: colors.primary,
                  color: "#fff",
                }}
              />
            )}
          </Button>

          {/* Risk filter button */}
          <Button
            variant="outlined"
            size="small"
            onClick={(e) => setRiskAnchor(e.currentTarget)}
            startIcon={
              <WarningAmberOutlinedIcon
                sx={{ fontSize: 18, color: colors.primary }}
              />
            }
            endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
            sx={{
              borderColor: bar.risk.length > 0 ? colors.primary : "#d4ccc0",
              color: bar.risk.length > 0 ? colors.primary : "#6b6560",
              bgcolor:
                bar.risk.length > 0 ? "rgba(139,115,85,0.06)" : "transparent",
              px: 2,
              py: 0.75,
              fontSize: 13,
              fontWeight: 500,
              "&:hover": {
                borderColor: colors.primary,
                bgcolor: "rgba(139,115,85,0.08)",
              },
            }}
          >
            Risk
            {bar.risk.length > 0 && (
              <Chip
                label={bar.risk.length}
                size="small"
                sx={{
                  ml: 0.75,
                  height: 20,
                  minWidth: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  bgcolor: colors.primary,
                  color: "#fff",
                }}
              />
            )}
          </Button>

          {/* Share Price filter button */}
          <Button
            variant="outlined"
            size="small"
            onClick={(e) => setPriceAnchor(e.currentTarget)}
            startIcon={
              <AttachMoneyIcon sx={{ fontSize: 18, color: colors.primary }} />
            }
            endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
            sx={{
              borderColor:
                bar.sharePriceMin || bar.sharePriceMax
                  ? colors.primary
                  : "#d4ccc0",
              color:
                bar.sharePriceMin || bar.sharePriceMax
                  ? colors.primary
                  : "#6b6560",
              bgcolor:
                bar.sharePriceMin || bar.sharePriceMax
                  ? "rgba(139,115,85,0.06)"
                  : "transparent",
              px: 2,
              py: 0.75,
              fontSize: 13,
              fontWeight: 500,
              "&:hover": {
                borderColor: colors.primary,
                bgcolor: "rgba(139,115,85,0.08)",
              },
            }}
          >
            Share Price
            {(bar.sharePriceMin || bar.sharePriceMax) && (
              <Chip
                label={
                  bar.sharePriceMin && bar.sharePriceMax
                    ? `$${bar.sharePriceMin}-$${bar.sharePriceMax}`
                    : bar.sharePriceMin
                      ? `>$${bar.sharePriceMin}`
                      : `<$${bar.sharePriceMax}`
                }
                size="small"
                sx={{
                  ml: 0.75,
                  height: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  bgcolor: colors.primary,
                  color: "#fff",
                }}
              />
            )}
          </Button>

          {/* Clear all */}
          {activeFilterCount > 0 && (
            <>
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 0.5, borderColor: "#e8e0d8" }}
              />
              <Button
                size="small"
                onClick={handleClearAll}
                sx={{
                  color: colors.primary,
                  fontSize: 13,
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: "rgba(139,115,85,0.08)",
                  },
                }}
              >
                Clear all ({activeFilterCount})
              </Button>
            </>
          )}
        </Box>

        {/* Active filter chips row */}
        {(bar.states.length > 0 ||
          bar.risk.length > 0 ||
          bar.sharePriceMin ||
          bar.sharePriceMax) && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.75,
              mt: 1.5,
              pt: 1.5,
              borderTop: "1px solid #f0ebe4",
            }}
          >
            {bar.states.map((state) => (
              <Chip
                key={state}
                label={state}
                size="small"
                onDelete={() => handleStateToggle(state)}
                deleteIcon={<CloseIcon sx={{ fontSize: "14px !important" }} />}
                sx={{
                  bgcolor: "rgba(139,115,85,0.08)",
                  color: colors.primaryHover,
                  fontSize: 12,
                  fontWeight: 500,
                  borderRadius: 1.5,
                  "& .MuiChip-deleteIcon": {
                    color: colors.primary,
                    "&:hover": { color: colors.primaryHover },
                  },
                }}
              />
            ))}
            {bar.risk.map((risk) => (
              <Chip
                key={risk}
                label={RISK_DISPLAY[risk]}
                size="small"
                onDelete={() => handleRiskToggle(risk)}
                deleteIcon={<CloseIcon sx={{ fontSize: "14px !important" }} />}
                sx={{
                  bgcolor: RISK_CHIP_COLORS[risk].bg,
                  color: RISK_CHIP_COLORS[risk].text,
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 1.5,
                  "& .MuiChip-deleteIcon": {
                    color: RISK_CHIP_COLORS[risk].text,
                    opacity: 0.7,
                    "&:hover": { opacity: 1 },
                  },
                }}
              />
            ))}
            {(bar.sharePriceMin || bar.sharePriceMax) && (
              <Chip
                label={`Price: ${bar.sharePriceMin ? `$${bar.sharePriceMin}` : "$0"} - ${bar.sharePriceMax ? `$${bar.sharePriceMax}` : "Any"}`}
                size="small"
                onDelete={() => updateBar({ sharePriceMin: "", sharePriceMax: "" })}
                deleteIcon={<CloseIcon sx={{ fontSize: "14px !important" }} />}
                sx={{
                  bgcolor: "rgba(139,115,85,0.08)",
                  color: colors.primaryHover,
                  fontSize: 12,
                  fontWeight: 500,
                  borderRadius: 1.5,
                  "& .MuiChip-deleteIcon": {
                    color: colors.primary,
                    "&:hover": { color: colors.primaryHover },
                  },
                }}
              />
            )}
          </Box>
        )}

        {/* ── STATES POPOVER ── */}
        <Popover
          open={Boolean(stateAnchor)}
          anchorEl={stateAnchor}
          onClose={() => {
            setStateAnchor(null);
            setStateSearch("");
          }}
          {...popoverProps}
        >
          <Box sx={{ width: 300, maxHeight: 420, display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 1.5, pb: 1 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Search states..."
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                autoFocus
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 18, color: "#9e9488" }} />
                      </InputAdornment>
                    ),
                    sx: { fontSize: 13, bgcolor: "#faf8f5" },
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                px: 2,
                py: 0.5,
              }}
            >
              <Button
                size="small"
                onClick={() => updateBar({ states: [...US_STATES] })}
                sx={{ fontSize: 12, color: colors.primary, fontWeight: 500, minWidth: 0 }}
              >
                Select all
              </Button>
              <Button
                size="small"
                onClick={() => updateBar({ states: [] })}
                sx={{ fontSize: 12, color: "#9e9488", fontWeight: 500, minWidth: 0 }}
              >
                Clear
              </Button>
            </Box>

            <Divider sx={{ borderColor: "#f0ebe4" }} />

            <Box sx={{ overflowY: "auto", maxHeight: 300, px: 0.5, py: 0.5 }}>
              <FormGroup>
                {filteredStates.map((state) => (
                  <FormControlLabel
                    key={state}
                    control={
                      <Checkbox
                        checked={bar.states.includes(state)}
                        onChange={() => handleStateToggle(state)}
                        size="small"
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: 13, color: "#3d3830" }}>
                        {state}
                      </Typography>
                    }
                    sx={{
                      mx: 0,
                      px: 1,
                      py: 0.15,
                      borderRadius: 1,
                      "&:hover": { bgcolor: "rgba(139,115,85,0.05)" },
                    }}
                  />
                ))}
                {filteredStates.length === 0 && (
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "#9e9488",
                      textAlign: "center",
                      py: 3,
                    }}
                  >
                    No states found
                  </Typography>
                )}
              </FormGroup>
            </Box>

            <Divider sx={{ borderColor: "#f0ebe4" }} />
            <Box sx={{ p: 1.5, display: "flex", justifyContent: "flex-end" }}>
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  setStateAnchor(null);
                  setStateSearch("");
                }}
                sx={{
                  bgcolor: colors.primary,
                  fontSize: 13,
                  px: 3,
                  "&:hover": { bgcolor: colors.primaryHover },
                }}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Popover>

        {/* ── RISK POPOVER ── */}
        <Popover
          open={Boolean(riskAnchor)}
          anchorEl={riskAnchor}
          onClose={() => setRiskAnchor(null)}
          {...popoverProps}
        >
          <Box sx={{ width: 220, p: 1 }}>
            <FormGroup>
              {RISK_OPTIONS.map((risk) => (
                <FormControlLabel
                  key={risk}
                  control={
                    <Checkbox
                      checked={bar.risk.includes(risk)}
                      onChange={() => handleRiskToggle(risk)}
                      size="small"
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: RISK_CHIP_COLORS[risk].text,
                        }}
                      />
                      <Typography sx={{ fontSize: 13, color: "#3d3830" }}>
                        {RISK_DISPLAY[risk]}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    mx: 0,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    "&:hover": { bgcolor: "rgba(139,115,85,0.05)" },
                  }}
                />
              ))}
            </FormGroup>
            <Divider sx={{ my: 1, borderColor: "#f0ebe4" }} />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                size="small"
                variant="contained"
                onClick={() => setRiskAnchor(null)}
                sx={{
                  bgcolor: colors.primary,
                  fontSize: 13,
                  px: 3,
                  "&:hover": { bgcolor: colors.primaryHover },
                }}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Popover>

        {/* ── SHARE PRICE POPOVER ── */}
        <Popover
          open={Boolean(priceAnchor)}
          anchorEl={priceAnchor}
          onClose={() => setPriceAnchor(null)}
          {...popoverProps}
        >
          <Box sx={{ width: 300, p: 2 }}>
            <Typography
              sx={{ fontSize: 13, fontWeight: 600, color: "#3d3830", mb: 1.5 }}
            >
              Share Price Range
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <TextField
                size="small"
                placeholder="0"
                value={bar.sharePriceMin}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  updateBar({ sharePriceMin: value });
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography sx={{ fontSize: 14, color: "#9e9488" }}>
                          $
                        </Typography>
                      </InputAdornment>
                    ),
                    sx: { fontSize: 14, bgcolor: "#faf8f5" },
                  },
                }}
                sx={{ flex: 1 }}
              />
              <Typography sx={{ fontSize: 13, color: "#9e9488" }}>to</Typography>
              <TextField
                size="small"
                placeholder="Any"
                value={bar.sharePriceMax}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  updateBar({ sharePriceMax: value });
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography sx={{ fontSize: 14, color: "#9e9488" }}>
                          $
                        </Typography>
                      </InputAdornment>
                    ),
                    sx: { fontSize: 14, bgcolor: "#faf8f5" },
                  },
                }}
                sx={{ flex: 1 }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 0.75, mt: 1.5, flexWrap: "wrap" }}>
              {[
                { label: "Under $10", min: "", max: "10" },
                { label: "$10-$50", min: "10", max: "50" },
                { label: "$50-$100", min: "50", max: "100" },
                { label: "Over $100", min: "100", max: "" },
              ].map((preset) => (
                <Chip
                  key={preset.label}
                  label={preset.label}
                  size="small"
                  clickable
                  onClick={() =>
                    updateBar({
                      sharePriceMin: preset.min,
                      sharePriceMax: preset.max,
                    })
                  }
                  sx={{
                    fontSize: 12,
                    bgcolor:
                      bar.sharePriceMin === preset.min &&
                      bar.sharePriceMax === preset.max
                        ? colors.primary
                        : "#f5f0ea",
                    color:
                      bar.sharePriceMin === preset.min &&
                      bar.sharePriceMax === preset.max
                        ? "#fff"
                        : "#6b6560",
                    fontWeight: 500,
                    "&:hover": {
                      bgcolor:
                        bar.sharePriceMin === preset.min &&
                        bar.sharePriceMax === preset.max
                          ? colors.primaryHover
                          : "#ebe5dc",
                    },
                  }}
                />
              ))}
            </Box>

            <Divider sx={{ my: 1.5, borderColor: "#f0ebe4" }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                size="small"
                onClick={() => updateBar({ sharePriceMin: "", sharePriceMax: "" })}
                sx={{ fontSize: 12, color: "#9e9488" }}
              >
                Reset
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => setPriceAnchor(null)}
                sx={{
                  bgcolor: colors.primary,
                  fontSize: 13,
                  px: 3,
                  "&:hover": { bgcolor: colors.primaryHover },
                }}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Popover>
      </Box>
    </ThemeProvider>
  );
};

export default SearchFilters;
