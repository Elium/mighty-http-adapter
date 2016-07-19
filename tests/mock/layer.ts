import {IDataLayer} from '../../src/layer';
import {IHttpRequest} from '../../src/http.request';
import {IHttpResponse, HttpResponse} from '../../src/http.response';
import {Observable} from 'rxjs/Rx';

export class MockLayer implements IDataLayer {

  public findOne(request: IHttpRequest): Observable<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "GET"});
    return Observable.of(new HttpResponse({data: localRequest}));
  }

  public find(request: IHttpRequest): Observable<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "GET", isArray: true});
    return Observable.of(new HttpResponse({data: localRequest}));
  }


  public create(request: IHttpRequest): Observable<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "POST"});
    return Observable.of(new HttpResponse({data: localRequest}));
  }


  public save(request: IHttpRequest): Observable<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "PUT"});
    return Observable.of(new HttpResponse({data: localRequest}));
  }


  public destroy(request: IHttpRequest): Observable<IHttpResponse> {
    const localRequest: IHttpRequest = request.merge(<IHttpRequest> {method: "DELETE"});
    return Observable.of(new HttpResponse({data: localRequest}));
  }
}

