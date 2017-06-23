input priceType = FundamentalType.CLOSE;
input type = AverageType.EXPONENTIAL;

def price = Fundamental(priceType);

input len1 = 89;
input len2 = 174;

input len3 = 610;
input len3to4 = 729;
input len4 = 980;

input len5 = 12;
input len6 = 26;

# Default / normal EMA's
plot ma1 = MovingAverage(type, price, len1); # 89
plot ma2 = MovingAverage(type, price, len2); # 174

def ma3 = MovingAverage(type, price, len3);
plot ma3to4 = MovingAverage(type, price, len3to4); # 729
def ma4 = MovingAverage(type, price, len4);

plot ma5 = MovingAverage(AverageType.SIMPLE, price, len5); # 12
plot ma6 = MovingAverage(AverageType.SIMPLE, price, len6); # 26

# Styling
ma1.SetStyle(curve.FIRM);
ma1.DefineColor("MAONE", color.yellow);
ma1.DefineColor("MATWO", color.green);
ma1.AssignValueColor(ma1.Color("MAONE"));

ma2.SetStyle(curve.SHORT_DASH);
ma2.AssignValueColor(ma1.Color("MAONE"));

ma3to4.SetStyle(curve.SHORT_DASH);
ma3to4.setDefaultColor(color.magenta);

ma5.AssignValueColor(ma1.Color("MATWO"));
ma6.SetDefaultColor(color.RED);

# Add xovers
plot i = if ma1 crosses ma2 then ma1 else double.NaN;
i.setLineWeight(5);
i.setStyle(curve.points);
i.AssignValueColor(ma1.color("MAONE"));
i.hide();

plot i2 = if ma5 crosses ma6 then ma5 else double.NaN;
i2.setLineWeight(5);
i2.setStyle(curve.points);
i2.hide();
i2.AssignValueColor(ma1.color("MATWO"));