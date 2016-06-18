'use strict';

import { getChildDebugElement } from '../../../tests/helpers';
import {Component, provide} from '@angular/core';

import {
  inject,
  async,
  beforeEach,
  beforeEachProviders,
  it
} from '@angular/core/testing';

import { TestComponentBuilder } from '@angular/compiler/testing';

import { ApiLogo } from './api-logo';
import { SchemaManager } from '../../utils/SchemaManager';


describe('Redoc components', () => {
  describe('ApiLogo Component', () => {
    let builder;
    let component;
    let fixture;
    let schemaMgr;

    let schemaUrl = '/tests/schemas/api-info-test.json';
    beforeEachProviders(() => [
        provide(SchemaManager, {useValue: new SchemaManager()})
    ]);
    beforeEach(async(inject([TestComponentBuilder, SchemaManager], (tcb, _schemaMgr) => {
      builder = tcb;
      schemaMgr = _schemaMgr;
      return schemaMgr.load(schemaUrl);
    })));
    beforeEach((done) => {
      builder.createAsync(TestAppComponent).then(_fixture => {
        fixture = _fixture;
        component = getChildDebugElement(fixture.debugElement, 'api-logo').componentInstance;
        fixture.detectChanges();
        done();
      }, err => done.fail(err));
    });


    it('should init component data', () => {
      expect(component).not.toBeNull();
      expect(component.data).not.toBeNull();
    });

    it('should not display image when no x-logo', () => {
      component.data.should.be.empty();
      let nativeElement = getChildDebugElement(fixture.debugElement, 'api-logo').nativeElement;
      let imgElement = nativeElement.querySelector('img');
      expect(imgElement).toBeNull();

      // update schemaUrl to load other schema in the next test
      schemaUrl = '/tests/schemas/extended-petstore.yml';
    });

    it('should load values from spec and use transparent bgColor by default', () => {
      component.data.imgUrl.should.endWith('petstore-logo.png');
      component.data.bgColor.should.be.equal('transparent');
    });
  });
});


/** Test component that contains an ApiInfo. */
@Component({
  selector: 'test-app',
  directives: [ApiLogo],
  providers: [SchemaManager],
  template:
      `<api-logo></api-logo>`
})
class TestAppComponent {
}