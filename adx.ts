declare lower;
declare once_per_bar;

input n = 14;

def gd_88 = high - high[1];
def gd_96 = low[1] - low;

def gda_104;
def gda_108;

# If price differences are equal or 0, set 104/108 to 0
if ((gd_88 < 0 and gd_96 < 0) or gd_88 == gd_96) then {
    gda_104 = 0;
    gda_108 = 0;
}

# Otherwise set 104 to the highs differentiation, 
# and 108 to the lows differentiation
else {
    gda_104 = if gd_88 > gd_96 then gd_88 else 0;
    gda_108 = if gd_88 < gd_96 then gd_96 else 0;
}

# Calculations

# High differentation modification
def gda_112;
gda_112 = gda_112[1] * (n - 1.0) / n + gda_104 / n;

# Low differentation modification
def gda_116;
gda_116 = gda_116[1] * (n - 1.0) / n + gda_108 / n;

# Do some crazy calculations.
def gda_120;
gda_120 = Max(
    Max(AbsValue(high - low), AbsValue(high - close[1])), 
    AbsValue(close[1] - low)
);

# No idea what this does.
def gda_124 = gda_124[1] * (n - 1.0) / n + gda_120 / n;

# Conditional work of some sort..?
def gda_128; 
def gda_132;
def gda_136;

if (gda_124 > 0) then {
    # Low and high %?
    gda_128 = 100.0 * (gda_112 / gda_124);
    gda_132 = 100.0 * (gda_116 / gda_124);
    
    # Crazy calculations again...
    gda_136 = if (gda_128 + gda_132) > 0 then 100.0 * (AbsValue(gda_128 - gda_132) / (gda_128 + gda_132)) else double.nan;
}

# Set to null if not applicable.
else {
    gda_128 = double.nan;
    gda_132 = double.nan;
    gda_136 = double.nan;
}

def res = res[1] * (n - 1.0) / n + gda_136 / n;
def last = res[1];

# Plot it all
input high_point = 35;
input low_point = 20;

plot dx = res;

dx.setDefaultColor(color.green);
dx.assignValueColor(if dx <= high_point then color.dark_gray else color.yellow);

addLabel(yes, "ADX="+dx);

def uhook = !(uhook[1] within n bars) and dx > high_point and dx < dx[1];

plot u_hook = if uhook then dx[-1] else double.nan;
u_hook.setStyle(curve.points);
u_hook.setPaintingStrategy(paintingStrategy.HISTOGRAM);
u_hook.setDefaultColor(color.WHITE);
#AssignPriceColor(if uhook then color.red else color.current);

plot h = high_point;
h.setDefaultColor(color.dark_gray);
h.setStyle(curve.firm);
h.hide();

plot m = 20;
m.setDefaultColor(color.dark_gray);
m.setStyle(curve.firm);
m.hide();

plot l = low_point;
l.setDefaultColor(color.dark_gray);
l.setStyle(curve.firm);
l.hide();