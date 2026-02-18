import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import CloseIcon from "@mui/icons-material/Close";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HomeIcon from "@mui/icons-material/Home";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import LandscapeIcon from "@mui/icons-material/Landscape";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  getRiskRating,
  getRiskLabel,
  getRiskColor,
  type RiskLevel,
} from "../utils/riskRating";
import { getHomeBuiltYear, getDaysSinceMoveIn, getOccupantSharePercent } from "../utils/homeBuiltYear";
import type { Property } from "../types";
import { colors } from "../theme";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    primary: {
      main: colors.primary,
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
  },
});

// Chart data
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const propertyValueData = [980, 1010, 1050, 1020, 1080, 1120, 1150, 1190, 1230, 1280, 1310, 1350];
const rentalIncomeData = [4200, 4350, 4500, 4400, 4600, 4750, 4800, 4900, 5000, 5100, 5200, 5350];

export interface PropertyData {
  id: string;
  url: string;
  homeType: string;
  image: string;
  status: string;
  currency: string;
  price: number;
  daysOnZillow: number;
  area: number;
  lotAreaValue: number;
  lotAreaUnits: string;
  addressRaw: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  };
  latitude: number;
  longitude: number;
  listingDetails: {
    isNewHome: boolean;
  };
  mediaDetails: {
    has3DModel: boolean;
    hasVideo: boolean;
  };
  photos: string[];
}

export interface InvestmentModalProps {
  open: boolean;
  onClose: () => void;
  /** App Property (normalized) or full PropertyData. Null when closed. */
  property: PropertyData | Property | null;
}

function isPropertyData(p: PropertyData | Property): p is PropertyData {
  return "addressRaw" in p && "photos" in p && typeof (p as PropertyData).address === "object";
}

/** Map app Property to PropertyData for the modal. */
function toPropertyData(property: Property): PropertyData {
  const addressLine = [property.address, property.city, property.state, property.zipCode].filter(Boolean).join(", ");
  return {
    id: property.id,
    url: "",
    homeType: (property.propertyType ?? "house").toUpperCase().replace(/\s+/g, "_"),
    image: property.images?.[0] ?? "",
    status: property.isForSale ? "FOR_SALE" : property.isForRent ? "FOR_RENT" : "UNKNOWN",
    currency: "$",
    price: property.price,
    daysOnZillow: 0,
    area: property.squareFeet ?? 0,
    lotAreaValue: property.lotSize ?? 0,
    lotAreaUnits: "sqft",
    addressRaw: addressLine,
    address: {
      street: property.address ?? "",
      city: property.city ?? "",
      state: property.state ?? "",
      zipcode: property.zipCode ?? "",
    },
    latitude: property.latitude ?? 0,
    longitude: property.longitude ?? 0,
    listingDetails: { isNewHome: false },
    mediaDetails: { has3DModel: false, hasVideo: false },
    photos: Array.isArray(property.images) ? property.images : [],
  };
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const color = getRiskColor(level);
  const label = getRiskLabel(level);

  return (
    <Chip
      label={label}
      sx={{
        backgroundColor: `${color}22`,
        color: color,
        border: `1.5px solid ${color}`,
        fontWeight: 700,
        fontSize: "0.75rem",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
      }}
    />
  );
}

function MetricCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: "rgba(0,0,0,0.04)",
        borderRadius: 2,
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <Typography
        variant="caption"
        sx={{ color: "rgba(0,0,0,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.65rem" }}
      >
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a1a", mt: 0.5 }}>
        {value}
      </Typography>
      {subtext && (
        <Typography variant="caption" sx={{ color: colors.primary, fontWeight: 600 }}>
          {subtext}
        </Typography>
      )}
    </Paper>
  );
}

function PhotoGallery({ photos }: { photos: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayPhotos = photos.slice(0, 12);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? displayPhotos.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === displayPhotos.length - 1 ? 0 : prev + 1));
  };

  if (displayPhotos.length === 0) return null;

  return (
    <Box>
      <Box sx={{ position: "relative", borderRadius: 2, overflow: "hidden", mb: 1.5 }}>
        <Box
          component="img"
          src={displayPhotos[currentIndex]}
          alt={`Property photo ${currentIndex + 1}`}
          sx={{
            width: "100%",
            height: 300,
            objectFit: "cover",
            display: "block",
          }}
        />
        <IconButton
          onClick={handlePrev}
          sx={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "#fff",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
          }}
          size="small"
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "rgba(0,0,0,0.6)",
            color: "#fff",
            "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
          }}
          size="small"
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            right: 12,
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "#fff",
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" sx={{ color: "#fff" }}>
            {currentIndex + 1} / {displayPhotos.length}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1 }}>
        {displayPhotos.map((photo, i) => (
          <Box
            key={i}
            component="img"
            src={photo}
            alt={`Thumbnail ${i + 1}`}
            onClick={() => setCurrentIndex(i)}
            sx={{
              width: 64,
              height: 48,
              objectFit: "cover",
              borderRadius: 1,
              cursor: "pointer",
              opacity: currentIndex === i ? 1 : 0.5,
              border: currentIndex === i ? `2px solid ${colors.primary}` : "2px solid transparent",
              transition: "all 0.2s",
              flexShrink: 0,
              "&:hover": { opacity: 1 },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default function InvestmentModal({ open, onClose, property }: InvestmentModalProps) {
  const data: PropertyData | null =
    property == null
      ? null
      : isPropertyData(property)
        ? property
        : toPropertyData(property);

  if (data == null) {
    return (
      <Dialog open={false} onClose={onClose}>
        <DialogContent />
      </Dialog>
    );
  }

  const riskLevel = getRiskRating(String(data.id));
  const totalShares = 10000;
  const pricePerShare = data.price / totalShares;

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: "#ffffff",
            backgroundImage: "none",
            borderRadius: 3,
            border: "1px solid rgba(0,0,0,0.12)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            maxHeight: "90vh",
            width: "100%",
          },
        }}
      >
        <DialogContent sx={{ p: 0, width: "100%", maxWidth: "100%" }}>
          <Box sx={{ p: 3, width: "100%", maxWidth: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2.5 }}>
              <Box>
                <Typography
                  variant="overline"
                  sx={{ color: "rgba(0,0,0,0.6)", letterSpacing: "0.12em" }}
                >
                  Investment Opportunity At:
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: "#1a1a1a" }}>
                  {data.address.street}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                  <Chip
                    icon={<TrendingUpIcon sx={{ fontSize: 14, color: colors.primary }} />}
                    label={`$${pricePerShare.toFixed(2)} / share`}
                    size="small"
                    sx={{
                      backgroundColor: `${colors.primary}1f`,
                      color: colors.primary,
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      border: `1px solid ${colors.primary}4d`,
                    }}
                  />
                </Stack>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <RiskBadge level={riskLevel} />
                <IconButton
                  onClick={onClose}
                  size="small"
                  sx={{ color: "rgba(0,0,0,0.6)", "&:hover": { color: "#1a1a1a" } }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <Grid container spacing={1.5} sx={{ mb: 2.5, width: "100%" }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <MetricCard label="Projected ROI" value="12.4%" subtext="+2.1% vs last yr" />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <MetricCard label="Cap Rate" value="6.8%" subtext="Above avg" />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <MetricCard label="Availble Shares" value="67%" subtext="Stable" />
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <MetricCard label="Annual Yield" value="8.2%" subtext="+1.4% growth" />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ width: "100%" }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: "rgba(0,0,0,0.02)",
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(0,0,0,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.65rem", mb: 1, display: "block" }}
                  >
                    Property Value Trend (in $K)
                  </Typography>
                  <LineChart
                    xAxis={[{ data: months.map((_, i) => i), scaleType: "point", valueFormatter: (v) => months[v] }]}
                    series={[
                      {
                        data: propertyValueData,
                        color: colors.primary,
                        area: true,
                        label: "Value ($K)",
                      },
                    ]}
                    height={200}
                    sx={{
                      "& .MuiChartsAxis-line": { stroke: "rgba(0,0,0,0.2)" },
                      "& .MuiChartsAxis-tick": { stroke: "rgba(0,0,0,0.2)" },
                      "& .MuiChartsAxis-tickLabel": { fill: "rgba(0,0,0,0.6) !important", fontSize: "0.7rem" },
                      "& .MuiAreaElement-root": { fillOpacity: 0.15 },
                      "& .MuiChartsLegend-root": { display: "none" },
                    }}
                    margin={{ left: 50, right: 20, top: 20, bottom: 30 }}
                  />
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: "rgba(0,0,0,0.02)",
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(0,0,0,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.65rem", mb: 1, display: "block" }}
                  >
                    Monthly Dividend Income
                  </Typography>
                  <BarChart
                    xAxis={[{ data: months.slice(0, 6), scaleType: "band" }]}
                    series={[
                      {
                        data: rentalIncomeData.slice(0, 6),
                        color: colors.primary,
                        label: "Income ($)",
                      },
                    ]}
                    height={200}
                    sx={{
                      "& .MuiChartsAxis-line": { stroke: "rgba(0,0,0,0.2)" },
                      "& .MuiChartsAxis-tick": { stroke: "rgba(0,0,0,0.2)" },
                      "& .MuiChartsAxis-tickLabel": { fill: "rgba(0,0,0,0.6) !important", fontSize: "0.7rem" },
                      "& .MuiChartsLegend-root": { display: "none" },
                    }}
                    margin={{ left: 55, right: 10, top: 20, bottom: 30 }}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ borderColor: "rgba(0,0,0,0.12)" }} />

          <Box sx={{ p: 3 }}>
            <Typography
              variant="overline"
              sx={{ color: "rgba(0,0,0,0.6)", letterSpacing: "0.12em", mb: 2, display: "block" }}
            >
              Property Details
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 18, color: colors.primary }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
                    {data.addressRaw}
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.6)", ml: 3.5 }}>
                  {data.address.city}, {data.address.state} {data.address.zipcode}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography variant="caption" sx={{ color: "rgba(0,0,0,0.6)" }}>
                  Estimated Value
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: colors.primary }}>
                  {data.currency}
                  {data.price.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <Grid container spacing={2} sx={{ width: "100%" }}>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: "rgba(0,0,0,0.02)",
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <HomeIcon sx={{ color: colors.primary, fontSize: 22 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "rgba(0,0,0,0.6)", fontSize: "0.65rem" }}>
                      Home Type
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                      {data.homeType.replace("_", " ")}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: "rgba(0,0,0,0.02)",
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <SquareFootIcon sx={{ color: colors.primary, fontSize: 22 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "rgba(0,0,0,0.6)", fontSize: "0.65rem" }}>
                      Living Area
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                      {data.area.toLocaleString()} sqft
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: "rgba(0,0,0,0.02)",
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <LandscapeIcon sx={{ color: colors.primary, fontSize: 22 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "rgba(0,0,0,0.6)", fontSize: "0.65rem" }}>
                      Lot Size
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                      {data.lotAreaValue} {data.lotAreaUnits}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: "rgba(0,0,0,0.02)",
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <CalendarTodayIcon sx={{ color: colors.primary, fontSize: 22 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "rgba(0,0,0,0.6)", fontSize: "0.65rem" }}>
                      Days since move-In
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                      {data.daysOnZillow
                        ? `${data.daysOnZillow} days`
                        : `${getDaysSinceMoveIn(data.id)} days`}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: "rgba(0,0,0,0.02)",
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <TrendingUpIcon sx={{ color: colors.primary, fontSize: 22 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "rgba(0,0,0,0.6)", fontSize: "0.65rem" }}>
                      Home Occupant Share
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: colors.primary }}>
                      {getOccupantSharePercent(data.id)}%
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: "rgba(0,0,0,0.02)",
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <HomeIcon sx={{ color: colors.primary, fontSize: 22 }} />
                  <Box>
                    <Typography variant="caption" sx={{ color: "rgba(0,0,0,0.6)", fontSize: "0.65rem" }}>
                      Home Built
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                      {getHomeBuiltYear(data.id)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ borderColor: "rgba(0,0,0,0.12)" }} />

          <Box sx={{ p: 3 }}>
            <Typography
              variant="overline"
              sx={{ color: "rgba(0,0,0,0.6)", letterSpacing: "0.12em", mb: 1.5, display: "block" }}
            >
              Property Photos
            </Typography>
            <PhotoGallery photos={data.photos} />
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}
