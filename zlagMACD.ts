input price = close;
input fastLength = 12;
input slowLength = 24;
input MACDLength = 9;
input BarsBack = 30;
input PlotLines = {default "NO", "YES"};
input PlotCrossovers = {default "NO", "YES"};
input colorBars = {default "NO", "YES"};

def EMAf = ExpAverage(price, fastLength);
def EMAs = ExpAverage(price, slowLength);
def EMAEMAf = ExpAverage(EMAf, fastLength);
def EMAEMAs = ExpAverage(EMAs, slowLength);
def ZLEMAf = EMAf + EMAf - EMAEMAf;
def ZLEMAs = EMAs + EMAs - EMAEMAs;
def TR = TRIX(9, 14, close, 3);

plot MACDValue = if PlotLines then (EMAf - EMAs) else Double.NaN;
plot SignalAvg = if PlotLines then ExpAverage(MACDValue, MACDLength) else Double.NaN;

plot Diff = ZLEMAf - ZLEMAs;
def ChartPeriod = GetAggregationPeriod() / 1000 / 60;

plot m = 0;
m.AssignValueColor(Color.DARK_GRAY);
m.setStyle(curve.firm);

Diff.SetDefaultColor(GetColor(5));
Diff.SetPaintingStrategy(PaintingStrategy.HISTOGRAM);
Diff.SetLineWeight(3);

Diff.DefineColor("Positive and Up", Color.GREEN);
Diff.DefineColor("Positive and Down", Color.DARK_GREEN);
Diff.DefineColor("Negative and Down", Color.GREEN);
Diff.DefineColor("Negative and Up", Color.DARK_GREEN);

Diff.AssignValueColor(if Diff >= 0 then if Diff > Diff[1] then Diff.Color("Positive and Up") else Diff.Color("Positive and Down") else if Diff < Diff[1] then Diff.Color("Negative and Down") else Diff.Color("Negative and Up"));

# Visual signals
AddLabel(yes, "MACD="+Diff);

def isSignal = Diff crosses 0;

AddVerticalLine(PlotCrossovers and isSignal, "", color.dark_green, curve.short_dash);
#AssignPriceColor(if Diff crosses above 0 and close <= close[1] then color.red else if Diff crosses below 0 and close >= close[1] then color.red else color.current);
Alert(isSignal, "MACD crossed 0");

# Genius!
def isLastBar = isNan(Diff[-1]) and !isNAN(Diff);

plot priceLine = highestAll(if isLastBar then Diff else double.nan);
priceLine.setDefaultColor(color.red);
