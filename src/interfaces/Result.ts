export type Either<L, A> = ErrClass<L, A> | SuccessClass<L, A>;

class ErrClass<L, A> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isErrClass(): this is ErrClass<L, A> {
    return true;
  }

  isSuccessClass(): this is SuccessClass<L, A> {
    return false;
  }
}
class SuccessClass<L, A> {
  readonly value: A;

  constructor(value: A) {
    this.value = value;
  }

  isErrClass(): this is ErrClass<L, A> {
    return false;
  }

  isSuccessClass(): this is SuccessClass<L, A> {
    return true;
  }
}

export const errClass = <L, A>(l: L): Either<L, A> => {
  return new ErrClass(l);
};

export const successClass = <L, A>(a: A): Either<L, A> => {
  return new SuccessClass<L, A>(a);
};
