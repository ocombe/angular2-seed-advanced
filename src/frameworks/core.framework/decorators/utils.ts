// angular
import {Component, ChangeDetectionStrategy} from 'angular2/core';

// libs
import {TranslatePipe} from 'ng2-translate/ng2-translate';

// app
import {CoreConfigService, ViewBrokerService} from '../index';

const _reflect: any = Reflect;

export class DecoratorUtils {
  public static getConfig(config: any = {}, opts?: any) {
    
    // default directives
    let DIRECTIVES: any[] = [];
    
    // default pipes
    let PIPES: any[] = [TranslatePipe];

    // default providers
    let PROVIDERS: any[] = [];

    // default viewProviders
    let VIEW_PROVIDERS: any[] = [];      
    
    // custom decorator options
    if (opts) {
      if (opts.directives) {
        DIRECTIVES.push(...opts.directives); 
      }
      if (opts.pipes) {
        PIPES.push(...opts.pipes); 
      }
      if (opts.providers) {
        PROVIDERS.push(...opts.providers); 
      }
      if (opts.viewProviders) {
        VIEW_PROVIDERS.push(...opts.viewProviders); 
      }
    }
    
    if (config.templateUrl) {
      // correct view for platform target
      config.templateUrl = ViewBrokerService.TEMPLATE_URL(config.templateUrl);
    }
    
    if (config.styleUrls && CoreConfigService.IS_MOBILE_NATIVE()) {
      // {N} doesn't support all css properties, therefore remove styleUrls to be safe
      delete config.styleUrls;
    }
    
    config.directives = config.directives ? config.directives.concat(DIRECTIVES) : DIRECTIVES;
    config.pipes = config.pipes ? config.pipes.concat(PIPES) : PIPES;
    config.providers = config.providers ? config.providers.concat(PROVIDERS) : PROVIDERS;
    config.viewProviders = config.viewProviders ? config.viewProviders.concat(VIEW_PROVIDERS) : VIEW_PROVIDERS;
    config.host = config.host || {};
    
    if (config.changeDetection) {
      config.changeDetection = config.changeDetection;
    } else {
      // default OnPush
      config.changeDetection = ChangeDetectionStrategy.OnPush;
    }
    
    if (config.encapsulation) {
      config.encapsulation = config.encapsulation;
    }
    
    // initialize anything 
    if (config.init) {
      config.init();
    }   

    return config;
  }
  
  public static annotateComponent(cls: any, config: any = {}, opts?: any) {
    let annotations = _reflect.getMetadata('annotations', cls) || [];
    annotations.push(new Component(DecoratorUtils.getConfig(config, opts)));
    _reflect.defineMetadata('annotations', annotations, cls);
    return cls;
  }
}
