#import <UIKit/UIKit.h>

#import <React/RCTComponentViewFactory.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTViewComponentView.h>

#import <react/renderer/components/rectimecomponents/ComponentDescriptors.h>
#import <react/renderer/components/rectimecomponents/Props.h>
#import <react/renderer/components/rectimecomponents/RCTComponentViewHelpers.h>

using namespace facebook::react;

static UIGlassEffectStyle RCTLiquidGlassEffectStyleFromProps(RCTLiquidGlassViewEffectStyle effectStyle)
    API_AVAILABLE(ios(26.0))
{
  switch (effectStyle) {
    case RCTLiquidGlassViewEffectStyle::Clear:
      return UIGlassEffectStyleClear;
    case RCTLiquidGlassViewEffectStyle::Regular:
      return UIGlassEffectStyleRegular;
  }
}

@interface RCTLiquidGlassViewComponentView : RCTViewComponentView <RCTRCTLiquidGlassViewViewProtocol>
@end

@implementation RCTLiquidGlassViewComponentView {
  UIVisualEffectView *_effectView;
}

+ (void)load
{
  [[RCTComponentViewFactory currentComponentViewFactory] registerComponentViewClass:self];
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RCTLiquidGlassViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    const auto defaultProps = RCTLiquidGlassViewShadowNode::defaultSharedProps();
    _props = defaultProps;

    self.userInteractionEnabled = NO;
    self.backgroundColor = UIColor.clearColor;

    _effectView = [[UIVisualEffectView alloc] initWithEffect:nil];
    _effectView.userInteractionEnabled = NO;
    _effectView.backgroundColor = UIColor.clearColor;
    _effectView.clipsToBounds = YES;

    self.contentView = _effectView;

    [self applyEffectWithProps:*defaultProps];
  }

  return self;
}

- (void)layoutSubviews
{
  [super layoutSubviews];

  _effectView.layer.cornerRadius = self.layer.cornerRadius;
  _effectView.layer.cornerCurve = kCACornerCurveContinuous;
}

- (void)updateProps:(const Props::Shared &)props oldProps:(const Props::Shared &)oldProps
{
  const auto &newViewProps = static_cast<const RCTLiquidGlassViewProps &>(*props);

  [self applyEffectWithProps:newViewProps];
  [super updateProps:props oldProps:oldProps];
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _effectView.effect = nil;
}

- (void)applyEffectWithProps:(const RCTLiquidGlassViewProps &)props
{
  if (@available(iOS 26.0, *)) {
    UIGlassEffect *effect = [UIGlassEffect effectWithStyle:RCTLiquidGlassEffectStyleFromProps(props.effectStyle)];
    effect.interactive = props.interactive;
    _effectView.effect = effect;
  } else {
    _effectView.effect = nil;
  }
}

@end

Class<RCTComponentViewProtocol> RCTLiquidGlassViewCls(void)
{
  return RCTLiquidGlassViewComponentView.class;
}
